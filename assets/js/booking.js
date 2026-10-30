/* Tal Pine: event booking wizard (occasion → date & guests → space & package → details).
   Availability is simulated so the flow can be demoed; wire it to the venue's calendar before launch. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { clamp, reduced } = window.TPutil;

  const state = {
    step: 1, occasion: null, date: null, guests: 250, guestsTouched: false, slot: 'evening',
    space: null, pkg: 'signature', addons: new Set(), view: null,
  };

  /* ---------- availability (deterministic per date) ---------- */
  const hash = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const status = (d) => {
    const min = today(); min.setDate(min.getDate() + 3);
    if (d < min) return 'past';
    const dow = d.getDay(); /* Thu 4, Fri 5, Sat 6 are the wedding nights */
    const peak = [5, 6, 7, 8, 9].includes(d.getMonth());
    let pFull = (dow === 4 || dow === 5) ? 0.55 : dow === 6 ? 0.35 : 0.08;
    if (peak) pFull += 0.18;
    if (state.slot === 'afternoon') pFull *= 0.45;
    const r = hash(iso(d) + state.slot);
    if (r < pFull) return 'full';
    if (r < pFull + 0.22) return 'few';
    return 'open';
  };

  /* ---------- formatting ---------- */
  const fmtDate = (isoStr, opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) =>
    new Intl.DateTimeFormat(locale(), opts).format(new Date(isoStr + 'T12:00:00'));
  const occ = () => TP.occasions.find((o) => o.id === state.occasion);
  const spc = () => TP.spaces.find((s) => s.id === state.space);
  const pkg = () => TP.packages.find((p) => p.id === state.pkg);

  /* ---------- step 1 ---------- */
  const renderOccasions = () => {
    $('#occasions').innerHTML = TP.occasions.map((o) => `
      <button type="button" class="pick" aria-pressed="${state.occasion === o.id}" data-occ="${o.id}">
        ${o.icon}<b>${L(o.name)}</b><small>${L(o.sub)}</small>
      </button>`).join('');
  };
  $('#occasions').addEventListener('click', (e) => {
    const b = e.target.closest('[data-occ]');
    if (!b) return;
    state.occasion = b.dataset.occ;
    if (!state.guestsTouched) setGuests(occ().guests);
    renderOccasions();
    $(`#occasions [data-occ="${state.occasion}"]`).focus();
    hideError();
    summary('occasion');
    setTimeout(() => go(2), reduced ? 0 : 260);
  });

  /* ---------- step 2 ---------- */
  const renderCalendar = () => {
    if (!state.view) { const d = today(); d.setDate(d.getDate() + 3); state.view = new Date(d.getFullYear(), d.getMonth(), 1); }
    const v = state.view;
    const first = new Date(v.getFullYear(), v.getMonth(), 1);
    const days = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();
    const lead = (first.getDay() + 1) % 7; /* weeks start on Saturday, as in Jordan */
    const dowFmt = new Intl.DateTimeFormat(locale(), { weekday: LANG === 'ar' ? 'long' : 'short' });
    const dows = Array.from({ length: 7 }, (_, i) => dowFmt.format(new Date(2026, 0, 3 + i)));
    const thisMonth = today(); thisMonth.setDate(1);
    const canPrev = first > thisMonth;
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const date = new Date(v.getFullYear(), v.getMonth(), d);
      const st = status(date);
      const id = iso(date);
      const off = st === 'past' || st === 'full';
      const label = `${fmtDate(id, { weekday: 'long', day: 'numeric', month: 'long' })}, ${st === 'past' ? '' : t('cal.' + (st === 'few' ? 'few' : st === 'full' ? 'full' : 'open'))}`;
      cells += `<button type="button" class="day" data-date="${id}" data-s="${st}" aria-pressed="${state.date === id}" aria-label="${label}" ${off ? 'disabled' : ''}>${d}</button>`;
    }
    $('#calendar').innerHTML = `
      <div class="cal__head">
        <button type="button" class="round" data-cal="-1" aria-label="${t('cal.prev')}" ${canPrev ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <b aria-live="polite">${new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(first)}</b>
        <button type="button" class="round" data-cal="1" aria-label="${t('cal.next')}"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
      </div>
      <div class="cal__grid">${dows.map((n) => `<span class="cal__dow">${LANG === 'ar' ? n.replace('ال', '') : n}</span>`).join('')}${cells}</div>`;
  };
  $('#calendar').addEventListener('click', (e) => {
    const nav = e.target.closest('[data-cal]');
    if (nav) {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + +nav.dataset.cal, 1);
      renderCalendar();
      const again = $(`#calendar [data-cal="${nav.dataset.cal}"]`);
      (again && !again.disabled ? again : $('#calendar [data-cal="1"]')).focus();
      return;
    }
    const day = e.target.closest('[data-date]');
    if (!day || day.disabled) return;
    state.date = day.dataset.date;
    renderCalendar();
    $(`#calendar [data-date="${state.date}"]`).focus();
    hideError();
    summary('date');
  });

  const range = $('#guests');
  const setGuests = (n) => {
    state.guests = clamp(Math.round(n / 10) * 10, 20, 800);
    range.value = state.guests;
    $('#guestsOut').textContent = state.guests;
    range.style.setProperty('--p', ((state.guests - 20) / 780) * 100 + '%');
    if (state.space && spc().cap < state.guests) state.space = null;
    summary('guests');
  };
  range.addEventListener('input', () => { state.guestsTouched = true; setGuests(+range.value); });

  $('#slotSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-slot]');
    if (!b) return;
    state.slot = b.dataset.slot;
    $$('#slotSeg [data-slot]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    if (state.date && status(new Date(state.date + 'T12:00:00')) === 'full') state.date = null;
    renderCalendar();
    summary('date');
  });

  /* ---------- step 3 ---------- */
  const bestSpace = () => {
    const fits = TP.spaces.filter((s) => s.cap >= state.guests);
    const forOcc = fits.filter((s) => s.events.includes(state.occasion));
    const pool = (forOcc.length ? forOcc : fits).sort((a, b) => a.cap - b.cap);
    return pool[0] ? pool[0].id : null;
  };
  const renderSpaces = () => {
    const best = bestSpace();
    const list = [...TP.spaces].sort((a, b) => (b.cap >= state.guests) - (a.cap >= state.guests) || (b.id === best) - (a.id === best));
    $('#spacePick').innerHTML = list.map((s) => {
      const ok = s.cap >= state.guests;
      return `<button type="button" class="pick space-opt" aria-pressed="${state.space === s.id}" data-sp="${s.id}" ${ok ? '' : 'aria-disabled="true"'}>
        ${s.id === best ? `<span class="badge">${t('fit.best')}</span>` : ''}
        <img src="${s.img}" alt="" loading="lazy">
        <span><b>${L(s.name)}</b><br><small class="fit ${ok ? 'is-ok' : 'is-no'}">${ok ? t('fit.ok', { n: state.guests }) : t('fit.no', { cap: s.cap })}</small></span>
      </button>`;
    }).join('');
  };
  $('#spacePick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sp]');
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    state.space = b.dataset.sp;
    renderSpaces();
    $(`#spacePick [data-sp="${state.space}"]`).focus();
    hideError();
    summary('space');
  });
  const renderPackages = () => {
    $('#packages').innerHTML = TP.packages.map((p) => `
      <button type="button" class="pick package" aria-pressed="${state.pkg === p.id}" data-pkg="${p.id}">
        <b>${L(p.name)}</b><ul>${L(p.items).map((i) => `<li>${i}</li>`).join('')}</ul>
      </button>`).join('');
    $('#addons').innerHTML = TP.addons.map((a) => `<button type="button" class="chip" aria-pressed="${state.addons.has(a.id)}" data-add="${a.id}">${L(a.name)}</button>`).join('');
  };
  $('#packages').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pkg]');
    if (!b) return;
    state.pkg = b.dataset.pkg; renderPackages(); $(`#packages [data-pkg="${state.pkg}"]`).focus(); summary('package');
  });
  $('#addons').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    state.addons.has(id) ? state.addons.delete(id) : state.addons.add(id);
    b.setAttribute('aria-pressed', String(state.addons.has(id)));
    summary('addons');
  });

  /* ---------- summary ---------- */
  const summary = (changed) => {
    const none = (v) => (v ? v : null);
    const rows = [
      ['occasion', t('sum.occasion'), none(occ() && L(occ().name))],
      ['date', t('sum.date'), none(state.date && `${fmtDate(state.date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}, ${t('wiz.' + state.slot)}`)],
      ['guests', t('sum.guests'), String(state.guests)],
      ['space', t('sum.space'), none(spc() && L(spc().name))],
      ['package', t('sum.package'), L(pkg().name)],
      ['addons', t('sum.addons'), state.addons.size ? addonNames() : t('sum.none')],
    ];
    $('#summaryList').innerHTML = rows.map(([k, label, v]) =>
      `<div><dt>${label}</dt><dd class="${v ? '' : 'is-empty'} ${k === changed ? 'flash' : ''}">${v || t('sum.empty')}</dd></div>`).join('');
  };

  /* ---------- navigation between steps ---------- */
  const errEl = $('#wizError');
  const hideError = () => { errEl.hidden = true; $$('.wizard .form-error-inline').forEach((n) => n.remove()); };
  const showError = (msg) => {
    const panel = $(`[data-panel="${state.step}"]`);
    let el = state.step === 4 ? errEl : panel.querySelector('.form-error-inline');
    if (!el) { el = document.createElement('p'); el.className = 'form-error form-error-inline'; el.setAttribute('role', 'alert'); panel.appendChild(el); }
    el.textContent = msg; el.hidden = false;
  };
  const validate = () => {
    if (state.step === 1 && !state.occasion) return t('err.occasion');
    if (state.step === 2 && !state.date) return t('err.date');
    if (state.step === 3 && !state.space) return t('err.space');
    if (state.step === 4) {
      const name = $('#fName'), phone = $('#fPhone');
      const okN = name.value.trim().length > 1, okP = phone.value.replace(/\D/g, '').length >= 9;
      name.setAttribute('aria-invalid', String(!okN)); phone.setAttribute('aria-invalid', String(!okP));
      if (!okN || !okP) { (okN ? phone : name).focus(); return t('err.contact'); }
    }
    return null;
  };

  const go = (n, focus = true) => {
    state.step = n;
    hideError();
    $$('.wizard [data-panel]').forEach((p) => { p.hidden = +p.dataset.panel !== n; });
    $$('#wizSteps li').forEach((li) => {
      const s = +li.dataset.step;
      li.classList.toggle('is-active', s === n);
      li.classList.toggle('is-done', s < n);
      if (s === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('#wizNav').hidden = n === 5;
    $('#wizBack').style.visibility = n === 1 ? 'hidden' : '';
    $('#wizNext').textContent = t(n === 4 ? 'wiz.send' : 'wiz.next');
    if (n === 2) renderCalendar();
    if (n === 3) { if (!state.space) state.space = bestSpace(); renderSpaces(); renderPackages(); summary(); }
    if (focus) {
      const panel = $(`[data-panel="${n}"]`);
      const target = panel.querySelector('legend') || panel;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      const top = $('#wizard').getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.6) $('#wizard').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  };
  $('#wizNext').addEventListener('click', () => {
    const err = validate();
    if (err) { showError(err); return; }
    if (state.step < 4) go(state.step + 1); else submit();
  });
  $('#wizBack').addEventListener('click', () => go(Math.max(1, state.step - 1)));
  $('#wizForm').addEventListener('submit', (e) => { e.preventDefault(); $('#wizNext').click(); });
  $$('#wizSteps li').forEach((li) => li.addEventListener('click', () => {
    const s = +li.dataset.step;
    if (s < state.step && state.step !== 5) go(s);
  }));

  /* ---------- submit ---------- */
  let lastRequest = null;
  const addonNames = () => [...state.addons].map((id) => L(TP.addons.find((a) => a.id === id).name)).join(LANG === 'ar' ? '، ' : ', ');
  const message = ({ ref, name, phone, email, notes }) => {
    const lines = [
      t('msg.hello'),
      `*${t('msg.event')}*`,
      `${t('msg.ref')}: ${ref}`,
      '',
      `${t('sum.occasion')}: ${L(occ().name)}`,
      `${t('sum.date')}: ${fmtDate(state.date)} (${t('wiz.' + state.slot)})`,
      `${t('sum.guests')}: ${state.guests}`,
      `${t('sum.space')}: ${L(spc().name)}`,
      `${t('sum.package')}: ${L(pkg().name)}`,
    ];
    if (state.addons.size) lines.push(`${t('sum.addons')}: ${addonNames()}`);
    lines.push('', `${t('msg.name')}: ${name}`, `${t('msg.mobile')}: ${phone}`);
    if (email) lines.push(`${t('msg.email')}: ${email}`);
    if (notes) lines.push(`${t('msg.notes')}: ${notes}`);
    lines.push('', `_${t('msg.footer')}_`);
    return lines.join('\n');
  };

  const submit = () => {
    const ref = `TP-${state.date.slice(5).replace('-', '')}-${String(Math.floor(hash(Date.now() + '') * 900) + 100)}`;
    const name = $('#fName').value.trim();
    const phone = $('#fPhone').value.trim();
    const email = $('#fEmail').value.trim();
    const notes = $('#fNotes').value.trim();
    const wa = TP.waLink(message({ ref, name, phone, email, notes }));
    TP.waOpen(wa);
    lastRequest = { ref, name, phone, date: state.date, occasion: L(occ().name), space: L(spc().name), guests: state.guests };
    $('#wizDone').innerHTML = `
      <svg class="done-mark" viewBox="0 0 90 90" aria-hidden="true"><circle cx="45" cy="45" r="40"/><path d="M28 46l11 11 23-24"/></svg>
      <h3>${t('done.title')}</h3>
      <p>${t('done.body', { name: TP.esc(name), phone: `<span dir="ltr">${TP.esc(phone)}</span>`, date: fmtDate(state.date) })}</p>
      <span class="ref" dir="ltr">${t('done.ref', { ref })}</span>
      <div class="done-actions">
        <a class="btn btn--saffron" href="${wa}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.4 18.6z"/><path d="M9.2 8.8c.2 2.3 2.7 4.8 5.1 5.1l1-1.1-1.6-.9-.7.7c-.9-.4-1.8-1.3-2.2-2.2l.7-.7-.9-1.6z"/></svg>${t('wa.open')}</a>
        <button type="button" class="btn btn--line" id="icsBtn">${t('done.ics')}</button>
        <a class="btn btn--line" href="tel:+96264299999">${t('done.call')}</a>
        <button type="button" class="btn btn--line" id="againBtn">${t('done.again')}</button>
      </div>`;
    go(5);
    $('#wizSteps li[data-step="4"]').classList.add('is-done');
    $('#wizSteps li[data-step="4"]').classList.remove('is-active');
  };
  $('#wizDone').addEventListener('click', (e) => {
    if (e.target.closest('#icsBtn')) downloadICS();
    if (e.target.closest('#againBtn')) reset();
  });
  const downloadICS = () => {
    const r = lastRequest;
    const d = r.date.replace(/-/g, '');
    const next = new Date(r.date + 'T12:00:00'); next.setDate(next.getDate() + 1);
    const d2 = iso(next).replace(/-/g, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tal Pine//Events//EN', 'BEGIN:VEVENT',
      `UID:${r.ref}@tal-pine.net`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
      `SUMMARY:${r.occasion} at Tal Pine (${r.ref})`, `LOCATION:Tal Pine\\, Airport Road\\, Amman`,
      `DESCRIPTION:${r.guests} guests\\, ${r.space}. Request ${r.ref}. Tal Pine events: +962 6 429 9999`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `tal-pine-${r.ref}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const reset = () => {
    Object.assign(state, { occasion: null, date: null, space: null, pkg: 'signature', guestsTouched: false });
    state.addons.clear();
    $('#wizForm').reset();
    setGuests(250);
    renderOccasions();
    go(1);
  };

  /* ---------- public: other sections hand requests to the wizard ---------- */
  window.Wizard = {
    prefill({ occasion, guests, space, notes, addons } = {}) {
      if (occasion) state.occasion = occasion;
      if (guests) { state.guestsTouched = true; setGuests(guests); }
      if (space) state.space = space;
      if (addons) addons.forEach((a) => state.addons.add(a));
      if (notes) $('#fNotes').value = notes;
      renderOccasions();
      summary();
      go(state.occasion ? 2 : 1, false);
    },
  };

  /* ---------- boot + language ---------- */
  const renderAll = () => {
    renderOccasions(); renderPackages();
    if (state.step === 2) renderCalendar();
    if (state.step === 3) renderSpaces();
    $$('#wizSteps b').forEach((b) => { b.textContent = t(b.dataset.i18n); });
    $('#wizNext').textContent = t(state.step === 4 ? 'wiz.send' : 'wiz.next');
    summary();
  };
  document.addEventListener('langchange', renderAll);
  setGuests(250);
  renderAll();
  go(1, false);
})();
