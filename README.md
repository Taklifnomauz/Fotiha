# Premium Gold Fotiha Invitation

A responsive, trilingual engagement invitation site (Uzbek, Russian, English), family RSVP form, separate event schedules/countdowns, Google Maps links, optional user-controlled music, Google Sheets storage, and private admin dashboard.

## Files
- `index.html`, `style.css`, `script.js`: public invitation.
- `config.js`: names, event dates/addresses/map links, music URL, backend URL.
- `admin.html`: private dashboard frontend (password checked by Apps Script backend).
- `apps-script/Code.gs`: Google Sheets RSVP backend and admin endpoints.

## 1. Personalize the invitation
Edit `config.js`:
- Replace `brideName` and `groomName`.
- Set the correct `mainDate`.
- Set each of the four event dates, venue names, addresses, and Google Maps links. Date format should include Uzbekistan offset, e.g. `2026-12-20T15:00:00+05:00`.
- Add a public HTTPS MP3 URL to `musicUrl` (use music you have permission to use).

The four event objects represent bride/women, bride/men, groom/women, and groom/men. Adjust or remove any event as needed.

## 2. Set up Google Sheets backend
1. Create a new Google Sheet in your Google account.
2. Open **Extensions → Apps Script**.
3. Copy `apps-script/Code.gs` into the Apps Script editor.
4. Open **Project Settings → Script properties** and add `ADMIN_PASSWORD` with a strong, unique password. Do not put this password in the public website files.
5. From the editor, select and run `setup()` once. Approve the requested permissions. This creates `Guests`, `SubmissionLog`, and `Meta` tabs.
6. Select **Deploy → New deployment → Web app**. Execute as **Me**. For public guest responses, set access to **Anyone** if that option is available for your Google account. Google Workspace policies may restrict this setting.
7. Deploy and copy the Web app URL (ends with `/exec`).
8. Paste it into `endpointUrl` in `config.js`.

The `Guests` sheet contains the latest state for each household submission ID. `SubmissionLog` retains every submission, including repeat submissions and revisions. A visitor's browser stores a random submission ID to let the same browser update a previous household response. If they switch devices or clear browser storage, a new ID is created; admin can still see both submissions in the history.

## 3. Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `fotiha-invitation`).
2. Upload `index.html`, `style.css`, `script.js`, `config.js`, `admin.html`, and the `apps-script` folder (you may keep the Apps Script file in the repo for backup).
3. In the repository, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish and open the URL it provides.

Public guest link will be the GitHub Pages URL. The admin page is `https://YOUR-USERNAME.github.io/YOUR-REPO/admin.html?endpoint=YOUR_APPS_SCRIPT_WEB_APP_URL`. Bookmark it privately. Do not share it publicly. The admin password is never embedded in the public HTML; the Apps Script validates it and issues a short-lived token. For stronger security, consider restricting access through a Google Workspace account or deploying a backend with proper user authentication. Because GitHub Pages is public, anything placed in `config.js` or other frontend files can be read by visitors.

## 4. Test before sharing
- Test all three languages on desktop and mobile.
- Test each event's date/time and map URL.
- Submit a family with one woman and one man, then verify totals in the sheet/admin.
- Submit again from the same browser to verify the revision/history behaviour.
- Test an invalid blank form and confirm it warns the guest.
- Test music on a real phone; browsers require a user gesture before audio plays.

## Important notes
- Replace all sample names, dates, venues, addresses, and links before sending invitations.
- The invitation itself is public. The admin data is protected by the Apps Script password check, but the public Apps Script endpoint accepts RSVP submissions by design. Do not collect sensitive personal data.
- The admin page expects the endpoint URL as the `endpoint` query parameter. Example: `admin.html?endpoint=https://script.google.com/macros/s/DEPLOYMENT_ID/exec`.
- If your Apps Script is linked to a standalone script rather than opened from the spreadsheet, change `SpreadsheetApp.getActiveSpreadsheet()` to use a spreadsheet ID stored in Script Properties.
