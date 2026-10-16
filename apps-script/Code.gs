/**
 * Fotiha Premium RSVP backend — Google Apps Script.
 * 1) Create a Google Sheet.
 * 2) Extensions > Apps Script; paste this file into Code.gs.
 * 3) In Project Settings > Script properties set ADMIN_PASSWORD to a strong password.
 * 4) Run setup() once and authorize.
 * 5) Deploy > New deployment > Web app; Execute as: Me; access: Anyone.
 * 6) Copy deployment URL into config.js endpointUrl.
 */
const SHEET_GUESTS = 'Guests';
const SHEET_LOG = 'SubmissionLog';
const SHEET_META = 'Meta';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open Apps Script from the target Google Sheet (Extensions > Apps Script).');
  ensureSheet_(ss, SHEET_GUESTS, ['submissionId','familyName','side','guestName','gender','attendance','language','updatedAt','revision']);
  ensureSheet_(ss, SHEET_LOG, ['timestamp','submissionId','familyName','side','guestCount','attendingCount','notAttendingCount','payloadJson','revision']);
  ensureSheet_(ss, SHEET_META, ['key','value']);
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_PASSWORD')) throw new Error('Set ADMIN_PASSWORD in Project Settings > Script properties before using admin actions.');
  return 'Setup complete';
}
function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name); if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (action === 'admin') {
    const token = String(e.parameter.token || '');
    if (!validToken_(token)) return json_({ok:false,message:'Unauthorized'}, 401);
    return json_(adminSummary_());
  }
  return json_({ok:true,service:'Fotiha RSVP',message:'RSVP service is running.'});
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'adminLogin') return adminLogin_(body);
    if (body.action === 'adminSummary') {
      if (!validToken_(String(body.token || ''))) return json_({ok:false,message:'Unauthorized'});
      return json_(adminSummary_());
    }
    if (body.action !== 'submit') return json_({ok:false,message:'Unknown action'});
    const clean = validateSubmission_(body);
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Spreadsheet is not linked. Open Apps Script from your Google Sheet.');
    const guestSheet = ss.getSheetByName(SHEET_GUESTS);
    const logSheet = ss.getSheetByName(SHEET_LOG);
    if (!guestSheet || !logSheet) throw new Error('Run setup() first.');
    const existing = guestSheet.getDataRange().getValues();
    const oldRows = [];
    for (let i=1;i<existing.length;i++) if (String(existing[i][0]) === clean.submissionId) oldRows.push(i+1);
    const oldRevision = oldRows.length ? Math.max(...oldRows.map(r=>Number(guestSheet.getRange(r,9).getValue())||1)) : 0;
    // A household submission is replaced atomically by the latest version, while SubmissionLog keeps every resubmission.
    oldRows.reverse().forEach(r=>guestSheet.deleteRow(r));
    const revision = oldRevision + 1;
    const now = new Date();
    const rows = clean.guests.map(g=>[clean.submissionId,clean.familyName,clean.side,g.name,g.gender,g.attendance,clean.lang,now,revision]);
    if (rows.length) guestSheet.getRange(guestSheet.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
    const yes = clean.guests.filter(g=>g.attendance==='yes').length;
    const no = clean.guests.filter(g=>g.attendance==='no').length;
    logSheet.appendRow([now,clean.submissionId,clean.familyName,clean.side,clean.guests.length,yes,no,JSON.stringify(clean),revision]);
    return json_({ok:true,updated:oldRevision>0,revision:revision});
  } catch (err) {
    return json_({ok:false,message:String(err && err.message || 'Request failed')});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
function validateSubmission_(b) {
  const submissionId = String(b.submissionId || '').trim();
  const familyName = String(b.familyName || '').trim().slice(0,120);
  const side = String(b.side || '');
  const lang = ['uz','ru','en'].includes(String(b.lang)) ? String(b.lang) : 'uz';
  if (!/^[a-zA-Z0-9-]{12,80}$/.test(submissionId)) throw new Error('Invalid submission ID.');
  if (!familyName) throw new Error('Enter the family or respondent name.');
  if (!['bride','groom'].includes(side)) throw new Error('Choose bride or groom side.');
  if (!Array.isArray(b.guests) || b.guests.length < 1 || b.guests.length > 30) throw new Error('Add between 1 and 30 guests.');
  const guests = b.guests.map(g=>{
    const name=String(g.name||'').trim().slice(0,100), gender=String(g.gender||''), attendance=String(g.attendance||'');
    if (!name || !['female','male'].includes(gender) || !['yes','no'].includes(attendance)) throw new Error('Every guest needs a name, gender and attendance answer.');
    return {name,gender,attendance};
  });
  return {submissionId,familyName,side,lang,guests};
}
function adminLogin_(body) {
  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!expected) return json_({ok:false,message:'Admin password is not configured.'});
  if (!constantTimeEqual_(String(body.password||''), expected)) return json_({ok:false,message:'Incorrect password.'});
  const token = Utilities.getUuid() + '.' + Utilities.getUuid();
  CacheService.getScriptCache().put('admin:'+token, 'valid', 21600);
  return json_({ok:true,token:token,summary:adminSummary_()});
}
function validToken_(token) { return !!token && CacheService.getScriptCache().get('admin:'+token)==='valid'; }
function constantTimeEqual_(a,b) { if (a.length !== b.length) return false; let x=0; for(let i=0;i<a.length;i++) x |= a.charCodeAt(i)^b.charCodeAt(i); return x===0; }
function adminSummary_() {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss && ss.getSheetByName(SHEET_GUESTS), log=ss && ss.getSheetByName(SHEET_LOG);
  if (!sh || !log) throw new Error('Run setup() first.');
  const values=sh.getDataRange().getValues();
  const guests=values.slice(1).filter(r=>r[0]).map(r=>({submissionId:String(r[0]),familyName:String(r[1]),side:String(r[2]),name:String(r[3]),gender:String(r[4]),attendance:String(r[5]),lang:String(r[6]),updatedAt:r[7] instanceof Date?r[7].toISOString():String(r[7]),revision:Number(r[8])||1}));
  const events=log.getDataRange().getValues();
  const history=events.slice(1).filter(r=>r[0]).slice(-300).reverse().map(r=>({timestamp:r[0] instanceof Date?r[0].toISOString():String(r[0]),submissionId:String(r[1]),familyName:String(r[2]),side:String(r[3]),guestCount:Number(r[4])||0,attendingCount:Number(r[5])||0,notAttendingCount:Number(r[6])||0,revision:Number(r[8])||1}));
  return {ok:true,stats:{totalRecords:guests.length,attending:guests.filter(g=>g.attendance==='yes').length,notAttending:guests.filter(g=>g.attendance==='no').length,women:guests.filter(g=>g.attendance==='yes'&&g.gender==='female').length,men:guests.filter(g=>g.attendance==='yes'&&g.gender==='male').length,bride:guests.filter(g=>g.attendance==='yes'&&g.side==='bride').length,groom:guests.filter(g=>g.attendance==='yes'&&g.side==='groom').length,households:new Set(guests.map(g=>g.submissionId)).size},guests,history};
}
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
