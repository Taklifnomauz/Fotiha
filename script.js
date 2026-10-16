(() => {
  'use strict';

  const cfg = window.INVITE_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const state = {
    lang: localStorage.getItem('fotiha_lang') || 'uz',
    guestCount: 1,
    submissionId: localStorage.getItem('fotiha_submission_id') || crypto.randomUUID(),
    musicStarted: false,
    lastPayload: null
  };

  const translations = {
    uz: {
      welcomeEyebrow:'SIZNI QUVONCHLI KUNIMIZGA TAKLIF ETAMIZ',
      welcomeTitle:'Fotiha marosimi',
      welcomeSub:'Samimiy taklifnomamizni oching',
      openInvite:'Taklifnomani ochish',
      brand:'Fotiha taklifnomasi',
      musicOn:'Musiqani yoqish',
      musicOff:'Musiqani o‘chirish',
      inviteEyebrow:'BISMILLAHIR ROHMANIR ROHIYM',
      inviteSub:'Sizni hayotimizdagi quvonchli kunlardan biriga',
      inviteTitle:'Fotiha marosimimizga taklif etamiz',
      quote:'Quvonchimizga sherik bo‘lishingiz biz uchun katta baxt.',
      scheduleEyebrow:'MAROSIM MA’LUMOTLARI',
      scheduleTitle:'Sizni kutamiz',
      scheduleSub:'Har bir marosim uchun vaqt va manzil',
      countEyebrow:'HAYAJONLI LAHZALARGACHA',
      countTitle:'Uchrashuvgacha qolgan vaqt',
      rsvpEyebrow:'JAVOBINGIZNI KUTAMIZ',
      rsvpTitle:'Ishtirokingizni tasdiqlang',
      rsvpSub:'Har bir oila a’zosini alohida kiriting.',
      familyLabel:'Oila / javob beruvchi nomi',
      familyPlaceholder:'Masalan: Ali Valiyevlar oilasi',
      sideLabel:'Qaysi tomonga taklif etilgansiz? *',
      sidePlaceholder:'Tomonni tanlang',
      brideSide:'Kelin tomoni',
      groomSide:'Kuyov tomoni',
      membersLabel:'Oila a’zolari',
      membersHelp:'Har bir kishining javobi alohida belgilanadi.',
      addPerson:'Kishi qo‘shish',
      sendResponse:'Javobni yuborish',
      privacyNote:'Ma’lumotlaringiz faqat marosimni tashkil etish uchun ishlatiladi.',
      thanksTitle:'Javobingiz uchun rahmat!',
      thanksText:'Javobingiz muvaffaqiyatli qabul qilindi.',
      editResponse:'Javobni o‘zgartirish',
      footerText:'Mehr va ezgu tilaklar ila',
      women:'Ayollar',
      men:'Erkaklar',
      bride:'Kelin tomoni',
      groom:'Kuyov tomoni',
      map:'Xaritada ochish',
      address:'Manzil',
      day:'Kun',
      hour:'Soat',
      minute:'Daqiqa',
      second:'Soniya',
      started:'Marosim boshlandi',
      ended:'Marosim yakunlandi',
      until:'Boshlanishigacha',
      guest:'Mehmon',
      fullName:'Ism-familiya *',
      namePlaceholder:'Ism va familiya',
      gender:'Jinsi *',
      chooseGender:'Tanlang',
      male:'Erkak',
      female:'Ayol',
      attendance:'Qatnashish *',
      yes:'Boraman',
      no:'Bormayman',
      remove:'Olib tashlash',
      errorFamily:'Oila / javob beruvchi nomini kiriting.',
      errorSide:'Kelin yoki kuyov tomonini tanlang.',
      errorGuest:'Har bir mehmonning ism-familiyasi, jinsi va qatnashish javobini to‘ldiring.',
      errorEndpoint:'Javob yuborish tizimi hali sozlanmagan. Iltimos, taklifnoma egasiga xabar bering.',
      errorNetwork:'Javob yuborilmadi. Internetni tekshirib, qayta urinib ko‘ring.',
      successYes:'Rahmat! Kelishingizni kutib qolamiz.',
      successNo:'Javobingiz uchun rahmat. Sizni tushunamiz.',
      repeat:'Avval yuborgan javobingiz yangilandi.'
    },

    ru: {
      welcomeEyebrow:'ПРИГЛАШАЕМ ВАС РАЗДЕЛИТЬ НАШУ РАДОСТЬ',
      welcomeTitle:'Помолвка',
      welcomeSub:'Откройте наше приглашение',
      openInvite:'Открыть приглашение',
      brand:'Приглашение на помолвку',
      musicOn:'Включить музыку',
      musicOff:'Выключить музыку',
      inviteEyebrow:'С БЛАГОСЛОВЕНИЕМ',
      inviteSub:'Приглашаем вас разделить один из радостных дней нашей жизни',
      inviteTitle:'Приглашаем на нашу помолвку',
      quote:'Для нас большая радость разделить этот день с вами.',
      scheduleEyebrow:'ИНФОРМАЦИЯ О МЕРОПРИЯТИИ',
      scheduleTitle:'Будем рады вас видеть',
      scheduleSub:'Время и адрес каждого мероприятия',
      countEyebrow:'ДО РАДОСТНОГО МОМЕНТА',
      countTitle:'Время до встречи',
      rsvpEyebrow:'ЖДЁМ ВАШ ОТВЕТ',
      rsvpTitle:'Подтвердите участие',
      rsvpSub:'Добавьте каждого члена семьи отдельно.',
      familyLabel:'Семья / имя отвечающего',
      familyPlaceholder:'Например: семья Али Валиева',
      sideLabel:'С какой стороны вы приглашены? *',
      sidePlaceholder:'Выберите сторону',
      brideSide:'Со стороны невесты',
      groomSide:'Со стороны жениха',
      membersLabel:'Члены семьи',
      membersHelp:'Ответ каждого человека указывается отдельно.',
      addPerson:'Добавить человека',
      sendResponse:'Отправить ответ',
      privacyNote:'Данные используются только для организации мероприятия.',
      thanksTitle:'Спасибо за ваш ответ!',
      thanksText:'Ваш ответ успешно принят.',
      editResponse:'Изменить ответ',
      footerText:'С теплом и наилучшими пожеланиями',
      women:'Женщины',
      men:'Мужчины',
      bride:'Сторона невесты',
      groom:'Сторона жениха',
      map:'Открыть карту',
      address:'Адрес',
      day:'Дни',
      hour:'Часы',
      minute:'Минуты',
      second:'Секунды',
      started:'Мероприятие началось',
      ended:'Мероприятие завершилось',
      until:'До начала',
      guest:'Гость',
      fullName:'Имя и фамилия *',
      namePlaceholder:'Имя и фамилия',
      gender:'Пол *',
      chooseGender:'Выберите',
      male:'Мужчина',
      female:'Женщина',
      attendance:'Участие *',
      yes:'Буду',
      no:'Не смогу прийти',
      remove:'Удалить',
      errorFamily:'Укажите семью или имя отвечающего.',
      errorSide:'Выберите сторону невесты или жениха.',
      errorGuest:'Укажите имя, пол и ответ для каждого гостя.',
      errorEndpoint:'Отправка ответов ещё не настроена. Свяжитесь с организатором.',
      errorNetwork:'Не удалось отправить ответ. Проверьте интернет и попробуйте снова.',
      successYes:'Спасибо! Будем рады вас видеть.',
      successNo:'Спасибо за ответ. Мы всё понимаем.',
      repeat:'Ваш предыдущий ответ обновлён.'
    },

    en: {
      welcomeEyebrow:'YOU ARE WARMLY INVITED TO SHARE OUR JOY',
      welcomeTitle:'Engagement Ceremony',
      welcomeSub:'Please open our invitation',
      openInvite:'Open invitation',
      brand:'Engagement invitation',
      musicOn:'Play music',
      musicOff:'Turn music off',
      inviteEyebrow:'WITH BLESSINGS',
      inviteSub:'We invite you to share one of the joyful days of our lives',
      inviteTitle:'You are invited to our engagement ceremony',
      quote:'It would mean so much to share this joyful day with you.',
      scheduleEyebrow:'EVENT DETAILS',
      scheduleTitle:'We look forward to seeing you',
      scheduleSub:'Time and location for each gathering',
      countEyebrow:'COUNTING DOWN TO OUR SPECIAL MOMENT',
      countTitle:'Time until we meet',
      rsvpEyebrow:'KINDLY REPLY',
      rsvpTitle:'Please confirm your attendance',
      rsvpSub:'Add each family member separately.',
      familyLabel:'Family / person responding',
      familyPlaceholder:'For example: Ali Valiev family',
      sideLabel:'Which side invited you? *',
      sidePlaceholder:'Choose a side',
      brideSide:'Bride’s side',
      groomSide:'Groom’s side',
      membersLabel:'Family members',
      membersHelp:'Set each person’s response separately.',
      addPerson:'Add person',
      sendResponse:'Submit response',
      privacyNote:'Your details are used only to organise the event.',
      thanksTitle:'Thank you for replying!',
      thanksText:'Your response has been received.',
      editResponse:'Edit response',
      footerText:'With love and best wishes',
      women:'Women',
      men:'Men',
      bride:'Bride’s side',
      groom:'Groom’s side',
      map:'Open map',
      address:'Address',
      day:'Days',
      hour:'Hours',
      minute:'Minutes',
      second:'Seconds',
      started:'The event has started',
      ended:'The event has ended',
      until:'Starts in',
      guest:'Guest',
      fullName:'Full name *',
      namePlaceholder:'First and last name',
      gender:'Gender *',
      chooseGender:'Choose',
      male:'Male',
      female:'Female',
      attendance:'Attendance *',
      yes:'Attending',
      no:'Unable to attend',
      remove:'Remove',
      errorFamily:'Enter the family name or the respondent’s name.',
      errorSide:'Choose the bride’s or groom’s side.',
      errorGuest:'Enter each guest’s full name, gender, and attendance response.',
      errorEndpoint:'Response submission is not configured yet. Please contact the host.',
      errorNetwork:'Could not submit your response. Check your connection and try again.',
      successYes:'Thank you! We look forward to seeing you.',
      successNo:'Thank you for letting us know.',
      repeat:'Your previous response has been updated.'
    }
  };

  const t = key =>
    (translations[state.lang] || translations.uz)[key] ||
    translations.uz[key] ||
    key;

  const dateFmt = d => {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d || '');

    const timePart = new Intl.DateTimeFormat(
      state.lang === 'ru' ? 'ru-RU' : 'en-GB',
      {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'Asia/Tashkent'
      }
    ).format(date);

    if (state.lang === 'uz') {
      const parts = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Tashkent'
      }).formatToParts(date);

      const get = type =>
        parts.find(part => part.type === type)?.value || '';

      const months = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
      ];

      const day = get('day');
      const month = months[Number(get('month')) - 1] || get('month');
      const year = get('year');

      return `${day}-${month} ${year}, ${timePart}`;
    }

    const locale = state.lang === 'ru' ? 'ru-RU' : 'en-GB';

    const datePart = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Tashkent'
    }).format(date);

    return `${datePart}, ${timePart}`;
  };

  const safeText = v =>
    String(v ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));

  function applyLanguage(lang) {
    state.lang = translations[lang] ? lang : 'uz';
    localStorage.setItem('fotiha_lang', state.lang);
    document.documentElement.lang = state.lang;

    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t(key)) el.textContent = t(key);
    });

    $$('[data-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.placeholder);
    });

    $$('.lang').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === state.lang);
    });

    const musicText = $('#musicToggle span');
    if (musicText) {
      musicText.textContent = state.musicStarted
        ? t('musicOff')
        : t('musicOn');
    }

    renderEvents();
    renderCountdowns();
    renderGuestList();
  }

  function eventLabel(e) {
    return `${t(e.audience === 'women' ? 'women' : 'men')} ${
      state.lang === 'uz'
        ? 'marosimi'
        : state.lang === 'ru'
          ? 'мероприятие'
          : 'event'
    }`;
  }

  function renderEvents() {
    const events = Array.isArray(cfg.events) ? cfg.events : [];

    const groups = [
      {
        audience: 'women',
        items: events.filter(e => e.audience === 'women')
      },
      {
        audience: 'men',
        items: events.filter(e => e.audience === 'men')
      }
    ].filter(g => g.items.length);

    $('#eventCards').innerHTML = groups.map(g => `
      <article class="event-card">
        <span class="event-tag">${safeText(t(g.audience))}</span>
        <h3>${safeText(t(g.audience))} ${
          safeText(
            state.lang === 'uz'
              ? 'marosimi'
              : state.lang === 'ru'
                ? 'мероприятие'
                : 'event'
          )
        }</h3>
        ${g.items
          .slice()
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(e => `
            <div class="event-subitem">
              <div class="event-venue">${safeText(e.venue || '')}</div>
              <div class="event-date">${safeText(dateFmt(e.date))}</div>
              <p class="event-address">${safeText(t('address'))}: ${safeText(e.address || '')}</p>
              ${e.mapsUrl
                ? `<a class="map-link" href="${safeText(e.mapsUrl)}" target="_blank" rel="noopener noreferrer">${safeText(t('map'))} ↗</a>`
                : ''
              }
            </div>
          `).join('')}
      </article>
    `).join('');
  }

  function nextEventForAudience(audience, now = Date.now()) {
    const list = (Array.isArray(cfg.events) ? cfg.events : [])
      .filter(e =>
        e.audience === audience &&
        Number.isFinite(new Date(e.date).getTime())
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return list.find(e => new Date(e.date).getTime() > now) ||
      list[list.length - 1] ||
      null;
  }

  function renderCountdowns() {
    const groups = [
      { audience: 'women', label: 'women' },
      { audience: 'men', label: 'men' }
    ].filter(g =>
      (Array.isArray(cfg.events) ? cfg.events : [])
        .some(e => e.audience === g.audience)
    );

    $('#countdowns').innerHTML = groups.map(g => `
      <article class="countdown-card" data-countdown="${g.audience}">
        <h3>${safeText(t(g.label))} ${
          safeText(
            state.lang === 'uz'
              ? 'marosimigacha'
              : state.lang === 'ru'
                ? 'до мероприятия'
                : 'until the event'
          )
        }</h3>
        <p class="countdown-status"></p>
        <div class="time-grid">
          <div class="time-unit"><strong data-part="d">--</strong><span>${t('day')}</span></div>
          <div class="time-unit"><strong data-part="h">--</strong><span>${t('hour')}</span></div>
          <div class="time-unit"><strong data-part="m">--</strong><span>${t('minute')}</span></div>
          <div class="time-unit"><strong data-part="s">--</strong><span>${t('second')}</span></div>
        </div>
      </article>
    `).join('');

    tickCountdowns();
  }

  function tickCountdowns() {
    const now = Date.now();

    $$('[data-countdown]').forEach(card => {
      const e = nextEventForAudience(card.dataset.countdown, now);
      const status = $('.countdown-status', card);
      const grid = $('.time-grid', card);

      if (!e) {
        if (status) {
          status.textContent = state.lang === 'uz'
            ? 'Sana sozlanmagan'
            : state.lang === 'ru'
              ? 'Дата не указана'
              : 'Date not configured';
        }
        return;
      }

      if (status) status.textContent = `${eventLabel(e)} · ${dateFmt(e.date)}`;

      const delta = new Date(e.date).getTime() - now;

      if (!Number.isFinite(delta)) {
        if (status) {
          status.textContent = state.lang === 'uz'
            ? 'Sana formatini tekshiring'
            : state.lang === 'ru'
              ? 'Проверьте формат даты'
              : 'Check date format';
        }
        return;
      }

      if (delta <= 0) {
        if (grid) {
          grid.innerHTML = `<p class="time-ended">${safeText(
            t(now - new Date(e.date).getTime() < 86400000 ? 'started' : 'ended')
          )}</p>`;
        }
        return;
      }

      if (grid && !grid.querySelector('[data-part="d"]')) {
        grid.innerHTML = `
          <div class="time-unit"><strong data-part="d">--</strong><span>${t('day')}</span></div>
          <div class="time-unit"><strong data-part="h">--</strong><span>${t('hour')}</span></div>
          <div class="time-unit"><strong data-part="m">--</strong><span>${t('minute')}</span></div>
          <div class="time-unit"><strong data-part="s">--</strong><span>${t('second')}</span></div>
        `;
      }

      const total = Math.floor(delta / 1000);

      const vals = {
        d: Math.floor(total / 86400),
        h: Math.floor(total % 86400 / 3600),
        m: Math.floor(total % 3600 / 60),
        s: total % 60
      };

      Object.entries(vals).forEach(([k, v]) => {
        const el = $(`[data-part="${k}"]`, card);
        if (el) {
          el.textContent = k === 'd' ? String(v) : String(v).padStart(2, '0');
        }
      });
    });
  }

  function addGuest(data = {}) {
    const index = ++state.guestCount;
    const card = document.createElement('article');

    card.className = 'guest-card';
    card.dataset.guest = '';

    card.innerHTML = `
      <div class="guest-card-head">
        <strong>${safeText(t('guest'))} ${$$('[data-guest]').length + 1}</strong>
        <button type="button" class="remove-guest">${safeText(t('remove'))} ×</button>
      </div>
      <div class="guest-fields">
        <div class="full">
          <label>${safeText(t('fullName'))}</label>
          <input class="guest-name" maxlength="100" autocomplete="name" placeholder="${safeText(t('namePlaceholder'))}" value="${safeText(data.name || '')}" required>
        </div>
        <div>
          <label>${safeText(t('gender'))}</label>
          <select class="guest-gender" required>
            <option value="">${safeText(t('chooseGender'))}</option>
            <option value="female" ${data.gender === 'female' ? 'selected' : ''}>${safeText(t('female'))}</option>
            <option value="male" ${data.gender === 'male' ? 'selected' : ''}>${safeText(t('male'))}</option>
          </select>
        </div>
        <div>
          <label>${safeText(t('attendance'))}</label>
          <div class="attendance-options">
            <label><input type="radio" name="att-${index}" value="yes" ${data.attendance === 'yes' ? 'checked' : ''}> ${safeText(t('yes'))}</label>
            <label><input type="radio" name="att-${index}" value="no" ${data.attendance === 'no' ? 'checked' : ''}> ${safeText(t('no'))}</label>
          </div>
        </div>
      </div>
    `;

    $('.remove-guest', card).addEventListener('click', () => {
      if ($$('[data-guest]').length > 1) {
        card.remove();
        renumberGuests();
      } else {
        $('.guest-name', card).value = '';
        $('.guest-gender', card).value = '';
        $$('input[type=radio]', card).forEach(r => r.checked = false);
      }
    });

    $('#guestList').append(card);
    renumberGuests();

    return card;
  }

  function renumberGuests() {
    $$('[data-guest]').forEach((card, i) => {
      const h = $('strong', card);
      if (h) h.textContent = `${t('guest')} ${i + 1}`;
    });
  }

  function renderGuestList() {
    const existing = $$('[data-guest]');

    if (!existing.length) {
      addGuest();
      return;
    }

    existing.forEach((card, i) => {
      const h = $('strong', card);
      if (h) h.textContent = `${t('guest')} ${i + 1}`;

      const rem = $('.remove-guest', card);
      if (rem) rem.textContent = `${t('remove')} ×`;

      const labels = $$('.guest-fields label', card);
      if (labels[0]) labels[0].textContent = t('fullName');
      if (labels[1]) labels[1].textContent = t('gender');
      if (labels[2]) labels[2].textContent = t('attendance');

      const inp = $('.guest-name', card);
      if (inp) inp.placeholder = t('namePlaceholder');

      const sel = $('.guest-gender', card);
      if (sel) {
        sel.options[0].text = t('chooseGender');
        sel.options[1].text = t('female');
        sel.options[2].text = t('male');
      }

      const radios = $$('.attendance-options label', card);
      if (radios[0]) radios[0].lastChild.textContent = ' ' + t('yes');
      if (radios[1]) radios[1].lastChild.textContent = ' ' + t('no');
    });
  }

  function makePayload() {
    const familyName = $('#familyName').value.trim();
    const side = $('#sideSelect').value;

    const guests = $$('[data-guest]').map(card => ({
      name: $('.guest-name', card).value.trim(),
      gender: $('.guest-gender', card).value,
      attendance: $('input[type=radio]:checked', card)?.value || ''
    }));

    return {
      action: 'submit',
      submissionId: state.submissionId,
      familyName,
      side,
      lang: state.lang,
      guests,
      clientTime: new Date().toISOString()
    };
  }

  async function submitForm(ev) {
    ev.preventDefault();

    const error = $('#formError');
    error.textContent = '';

    const payload = makePayload();

    if (!payload.familyName) {
      error.textContent = t('errorFamily');
      $('#familyName').focus();
      return;
    }

    if (!payload.side) {
      error.textContent = t('errorSide');
      $('#sideSelect').focus();
      return;
    }

    if (!payload.guests.length || payload.guests.some(g => !g.name || !g.gender || !g.attendance)) {
      error.textContent = t('errorGuest');
      const first = $('[data-guest] .guest-name');
      if (first) first.focus();
      return;
    }

    if (!cfg.endpointUrl) {
      error.textContent = t('errorEndpoint');
      return;
    }

    const btn = $('.submit-button');
    btn.disabled = true;
    btn.style.opacity = '.7';

    const span = $('span', btn);
    const old = span.textContent;
    span.textContent = '…';

    try {
      const response = await fetch(cfg.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'submit failed');
      }

      state.lastPayload = payload;

      $('#rsvpSection').classList.add('hidden');
      $('#thankYou').classList.remove('hidden');

      $('#thanksMessage').textContent = payload.guests.some(
        g => g.attendance === 'yes'
      ) ? t('successYes') : t('successNo');

      if (result.updated) {
        $('#thanksMessage').textContent += ' ' + t('repeat');
      }

      $('#thankYou').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } catch (err) {
      console.error(err);
      error.textContent = t('errorNetwork');
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
      span.textContent = old;
    }
  }

  function startPetals() {
    const layer = $('.petal-layer');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (let i = 0; i < 12; i++) {
      const p = document.createElement('span');

      p.className = 'petal';
      p.textContent = ['✦', '❦', '✧'][i % 3];
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDuration = (10 + Math.random() * 12) + 's';
      p.style.animationDelay = (-Math.random() * 15) + 's';
      p.style.fontSize = (10 + Math.random() * 10) + 'px';

      layer.append(p);
    }
  }

  // TAKLIFNOMANI OCHISH + MUSIQANI AVTOMATIK YOQISH
  $('#openInvitation').addEventListener('click', async () => {
    const env = $('.envelope');
    const audio = $('#bgMusic');

    // Musiqa fayli config.js orqali olinadi.
    if (audio && cfg.musicUrl) {
      if (!audio.getAttribute('src')) {
        audio.src = cfg.musicUrl;
      }

      audio.loop = true;

      try {
        await audio.play();
        state.musicStarted = true;

        const musicText = $('#musicToggle span');
        if (musicText) musicText.textContent = t('musicOff');
      } catch (error) {
        state.musicStarted = false;
        console.warn('Musiqani avtomatik yoqib bo‘lmadi:', error);
      }
    } else {
      console.warn('Musiqa fayli topilmadi. config.js dagi musicUrl ni tekshiring.');
    }

    // Taklifnomani ochish
    if (env) env.classList.add('open');

    setTimeout(() => {
      $('#welcome').classList.add('hidden');
      $('#invitation').classList.remove('hidden');
      $('#invitation').scrollIntoView({ behavior: 'smooth' });
    }, 650);
  });

  // TILNI ALMASHTIRISH
  $$('.lang').forEach(b => {
    b.addEventListener('click', () => applyLanguage(b.dataset.lang));
  });

  // MEHMON QO‘SHISH
  $('#addGuest').addEventListener('click', () => addGuest());

  // RSVP FORMASINI YUBORISH
  $('#rsvpForm').addEventListener('submit', submitForm);

  // JAVOBNI QAYTA TAHRIRLASH
  $('#editResponse').addEventListener('click', () => {
    $('#thankYou').classList.add('hidden');
    $('#rsvpSection').classList.remove('hidden');
    $('#rsvpSection').scrollIntoView({ behavior: 'smooth' });
  });

  // ALOHIDA MUSIQA TUGMASI HAM ISHLAYDI
  $('#musicToggle').addEventListener('click', async () => {
    const audio = $('#bgMusic');

    if (!cfg.musicUrl) {
      $('#musicToggle span').textContent =
        state.lang === 'uz'
          ? 'Musiqa fayli sozlanmagan'
          : state.lang === 'ru'
            ? 'Музыкальный файл не настроен'
            : 'Music file is not configured';
      return;
    }

    if (!audio.getAttribute('src')) {
      audio.src = cfg.musicUrl;
    }

    audio.loop = true;

    if (audio.paused) {
      try {
        await audio.play();
        state.musicStarted = true;
      } catch (error) {
        state.musicStarted = false;
        console.warn('Musiqani yoqib bo‘lmadi:', error);
      }
    } else {
      audio.pause();
      state.musicStarted = false;
    }

    $('#musicToggle span').textContent = state.musicStarted
      ? t('musicOff')
      : t('musicOn');
  });

  // KELIN-KUYOV ISMLARI, SANA VA MUSIQA FAYLI
  $('#brideName').textContent = cfg.brideName || 'Kelin ismi';
  $('#groomName').textContent = cfg.groomName || 'Kuyov ismi';
  $('#mainDate').textContent = dateFmt(cfg.mainDate || '');

  const bgMusic = $('#bgMusic');

  if (bgMusic && cfg.musicUrl) {
    bgMusic.src = cfg.musicUrl;
    bgMusic.loop = true;
  } else if (bgMusic) {
    bgMusic.removeAttribute('src');
  }

  // SAYTNI BOSHLASH
  applyLanguage(state.lang);
  startPetals();
  setInterval(tickCountdowns, 1000);
})();
