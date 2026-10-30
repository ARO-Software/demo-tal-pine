/* Tal Pine: page behavior (nav, hero, day/night, spaces, menu, reservations). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const isRTL = () => document.documentElement.dir === 'rtl';
  const hasGSAP = () => window.gsap && window.ScrollTrigger;

  /* time on the hill (Asia/Amman) */
  const ammanNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Amman', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => +parts.find((p) => p.type === t).value;
    return { h: get('hour'), m: get('minute') };
  };
  const ammanTimeLabel = () => new Intl.DateTimeFormat(locale(), { timeZone: 'Asia/Amman', hour: 'numeric', minute: '2-digit' }).format(new Date());
  window.TPutil = { ammanNow, clamp, reduced };

  applyI18n();

  /* ---------------- nav ---------------- */
  const nav = $('#nav');
  const sheet = $('#sheet');
  const burger = $('#burger');
  const dock = $('#dock');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const heroEnd = ($('.hero').offsetHeight || innerHeight) - nav.offsetHeight;
    nav.classList.toggle('is-solid', y > heroEnd - 40);
    nav.classList.toggle('is-hidden', y > heroEnd && y > lastY + 4 && sheet.hidden);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    dock.classList.toggle('is-on', y > innerHeight * 0.9);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  const setSheet = (open) => {
    sheet.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.sr').textContent = t(open ? 'nav.close' : 'nav.open');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.classList.add('is-solid'); else onScroll();
  };
  burger.addEventListener('click', () => setSheet(sheet.hidden));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setSheet(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });

  /* highlight the section in view */
  const links = $$('.nav__links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['hill', 'spaces', 'menu', 'weddings', 'designer', 'visit'].forEach((id) => io.observe(document.getElementById(id)));

  /* open / closed (12 pm to 1 am) */
  const renderOpen = () => {
    const { h } = ammanNow();
    const open = h >= 12 || h < 1;
    const el = $('#openNow');
    el.textContent = t(open ? 'hero.openNow' : 'hero.opensAt');
    el.previousElementSibling.classList.toggle('is-closed', !open);
  };

  /* ---------------- hero ---------------- */
  const hero = (() => {
    const stage = $('.hero__stage');
    const maskG = $('#maskLetters');
    const lineG = $('#outlineLetters');
    const fill = $('#maskFill');
    const outline = $('.hero__outline');
    const svg = $('#stencil');
    const video = $('#heroVideo');
    const copy = $('#heroCopy');
    const tagline = $('#heroTagline');
    const shade = $('#heroShade');
    const tint = $('#heroTint');
    const cue = $('#heroCue');
    /* letter space from the traced logo; F = centre of the thickest stroke (the bowl of the ص), R = its radius */
    const W0 = 2340, H0 = 2010, FX = 804, FY = 1527, R = 128;
    let L = {};

    const layout = () => {
      const vw = stage.clientWidth, vh = stage.clientHeight;
      if (!vw || !vh) return;
      const mobile = vw < 760;
      const maxW = mobile ? vw * 0.9 : Math.min(vw * 0.6, 1000);
      const maxH = mobile ? vh * 0.42 : vh * 0.6;
      const k = Math.min(maxW / W0, maxH / H0);
      const bw = W0 * k, bh = H0 * k;
      const ox = (vw - bw) / 2;
      const oy = mobile ? vh * 0.37 - bh / 2 : vh * 0.42 - bh / 2;
      const S = (1.12 * Math.hypot(vw, vh)) / 2 / (R * k);
      L = { vw, vh, k, ox, oy, S };
    };

    const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    let progress = 0;
    const render = (p = progress) => {
      progress = p;
      if (!L.k) return;
      const pz = clamp(p / 0.8);
      const s = Math.pow(L.S, easeInOut(pz));
      const glide = easeInOut(clamp(pz * 1.4));
      const fx0 = L.ox + FX * L.k, fy0 = L.oy + FY * L.k;
      const px = fx0 + (L.vw / 2 - fx0) * glide;
      const py = fy0 + (L.vh / 2 - fy0) * glide;
      const tr = `translate(${px - FX * L.k * s} ${py - FY * L.k * s}) scale(${L.k * s})`;
      maskG.setAttribute('transform', tr);
      lineG.setAttribute('transform', tr);
      svg.style.opacity = pz > 0.985 ? 0 : 1;
      lineG.style.opacity = 1 - clamp(p / 0.25);
      video.style.transform = `scale(${1 + 0.1 * pz})`;
      tint.style.opacity = 0.26 * (1 - clamp(pz / 0.45));
      const c = clamp(p / 0.16);
      copy.style.opacity = 1 - c;
      copy.style.transform = `translateY(${-30 * c}px)`;
      copy.style.visibility = c >= 1 ? 'hidden' : '';
      cue.style.opacity = 1 - c;
      shade.style.opacity = clamp((p - 0.55) / 0.25);
      const tg = clamp((p - 0.7) / 0.18);
      tagline.style.opacity = tg;
      tagline.style.transform = `translateY(${(1 - tg) * 24}px)`;
    };

    const intro = () => {
      const lines = $$('.hero__copy > *');
      if (reduced) {
        fill.style.opacity = 1; outline.style.strokeDashoffset = 0;
        lines.forEach((el) => { el.style.opacity = 1; });
        return;
      }
      fill.style.opacity = 0;
      outline.style.strokeDashoffset = 1;
      lines.forEach((el) => { el.style.opacity = 0; el.style.transform = 'translateY(18px)'; });
      outline.getBoundingClientRect();
      setTimeout(() => {
        outline.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.65,0,.35,1)';
        outline.style.strokeDashoffset = 0;
        setTimeout(() => {
          fill.style.transition = 'opacity 1.1s cubic-bezier(.22,1,.36,1)';
          fill.style.opacity = 1;
        }, 950);
        lines.forEach((el, i) => {
          el.style.transition = `opacity .9s ${1.4 + i * 0.12}s cubic-bezier(.22,1,.36,1), transform .9s ${1.4 + i * 0.12}s cubic-bezier(.22,1,.36,1)`;
          el.style.opacity = 1; el.style.transform = 'none';
          el.addEventListener('transitionend', () => { el.style.transition = ''; el.style.transform = ''; }, { once: true });
        });
      }, 60);
    };

    const init = () => {
      layout(); render(0); intro();
      addEventListener('resize', () => { layout(); render(); });
      if (reduced || !hasGSAP()) return;
      ScrollTrigger.create({
        trigger: '.hero', start: 'top top', end: '+=170%', pin: '.hero__stage', scrub: 0.5,
        onUpdate: (self) => render(self.progress), onRefresh: () => { layout(); render(); },
      });
    };
    /* keep the reel playing even if autoplay was deferred */
    video.play && video.play().catch(() => {});
    return { init };
  })();

  /* ---------------- day / night ---------------- */
  const hill = $('#hill');
  let userPickedMode = false;
  const setMode = (mode, animate = true) => {
    if (hill.dataset.mode === mode && animate) return;
    hill.dataset.mode = mode;
    $$('#dayNight [role=radio]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    $$('.hill__mood, .collage', hill).forEach((el) => {
      const on = el.dataset.for === mode;
      el.hidden = !on;
      if (on && animate && !reduced) {
        el.classList.remove('is-entering'); void el.offsetWidth; el.classList.add('is-entering');
      }
    });
    $$('.collage[data-for="' + mode + '"] img').forEach((img) => { img.loading = 'eager'; });
  };
  const renderClock = () => {
    const { h } = ammanNow();
    const night = h >= 18 || h < 6;
    $('#hillClock').textContent = t(night ? 'hill.clockNight' : 'hill.clockDay', { time: ammanTimeLabel() });
    if (!userPickedMode) setMode(night ? 'night' : 'day', false);
  };
  $('#dayNight').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    userPickedMode = true;
    setMode(b.dataset.mode);
  });
  $('#dayNight').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    userPickedMode = true;
    const next = hill.dataset.mode === 'day' ? 'night' : 'day';
    setMode(next);
    $(`#dayNight [data-mode="${next}"]`).focus();
  });

  /* ---------------- spaces rail ---------------- */
  const renderSpaces = () => {
    $('#railTrack').innerHTML = TP.spaces.map((s) => `
      <article class="space">
        <div class="space__img"><img src="${s.img}" alt="${L(s.alt)}" loading="lazy"><span class="space__cap">${L(s.capText)}</span></div>
        <div>
          <h3>${L(s.name)}</h3>
          <p>${L(s.desc)}</p>
          <button type="button" class="space__link" data-space="${s.id}">${t('space.plan')}</button>
        </div>
      </article>`).join('');
  };
  $('#railTrack').addEventListener('click', (e) => {
    const b = e.target.closest('[data-space]');
    if (!b || !window.Wizard) return;
    const sp = TP.spaces.find((s) => s.id === b.dataset.space);
    window.Wizard.prefill({ space: sp.id, occasion: sp.events[0], guests: Math.min(sp.cap, Math.max(sp.min, 120)) });
    document.getElementById('weddings').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
  $$('[data-rail]').forEach((b) => b.addEventListener('click', () => {
    const rail = $('#rail');
    const card = $('.space', rail);
    const step = (card ? card.offsetWidth + 24 : 360) * +b.dataset.rail * (isRTL() ? -1 : 1);
    if (spacesST) {
      const st = spacesST;
      const target = clamp(st.progress + (+b.dataset.rail) / TP.spaces.length);
      scrollTo({ top: st.start + (st.end - st.start) * target, behavior: 'smooth' });
    } else {
      rail.scrollBy({ left: step, behavior: 'smooth' });
    }
  }));

  let spacesST = null;
  const pinSpaces = () => {
    if (spacesST) { spacesST.kill(true); spacesST = null; gsap.set('#railTrack', { clearProps: 'transform' }); }
    const rail = $('#rail');
    const section = $('.spaces');
    rail.classList.remove('rail--pinned'); section.classList.remove('is-pinned');
    if (reduced || !hasGSAP() || innerWidth < 900 || innerHeight < 640) return;
    rail.classList.add('rail--pinned'); section.classList.add('is-pinned');
    const track = $('#railTrack');
    const dist = () => Math.max(0, track.scrollWidth - rail.clientWidth + parseFloat(getComputedStyle(rail).paddingInlineStart) * 2);
    if (dist() < 40) { rail.classList.remove('rail--pinned'); section.classList.remove('is-pinned'); return; }
    const sign = isRTL() ? 1 : -1;
    const tween = gsap.to(track, { x: () => sign * dist(), ease: 'none' });
    spacesST = ScrollTrigger.create({
      trigger: '.spaces', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6,
      animation: tween, invalidateOnRefresh: true,
    });
  };

  /* ---------------- menu ---------------- */
  const renderMenu = () => {
    $('#dishes').innerHTML = TP.dishes.map((d) => `
      <article class="dish">
        <figure><img src="${d.img}" alt="${L(d.name)}" loading="lazy"></figure>
        <h3>${L(d.name)}</h3>
        <p class="alt" lang="${LANG === 'ar' ? 'en' : 'ar'}">${L(d.alt)}</p>
        <p>${L(d.desc)}</p>
      </article>`).join('');
    $('#alsoList').innerHTML = TP.also.map((a) => `<li><b>${L(a.name)}</b><span>${L(a.desc)}</span></li>`).join('');
  };

  /* ---------------- reveals ---------------- */
  const reveal = () => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const targets = $$('.space__img, .dish figure, .weddings__film img, .visit__map').filter((el) => !el.classList.contains('rv'));
    /* a fully clipped element never reports as intersecting, so watch its parent instead */
    const byParent = new Map();
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        (byParent.get(en.target) || []).forEach((el) => el.classList.add('is-in'));
        ob.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach((el, i) => {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      const parent = el.parentElement;
      if (!byParent.has(parent)) { byParent.set(parent, []); ob.observe(parent); }
      byParent.get(parent).push(el);
    });
  };
  /* horizontal rail cards are revealed as a set because they are off-screen sideways */
  const revealRail = () => $$('.space__img').forEach((el) => el.classList.add('is-in'));

  const filmParallax = () => {
    if (reduced || !hasGSAP()) return;
    $$('.weddings__film img').forEach((img, i) => {
      gsap.fromTo(img, { y: 40 + i * 18 }, { y: -30 - i * 10, ease: 'none', scrollTrigger: { trigger: '.weddings', start: 'top bottom', end: 'top top', scrub: true } });
    });
  };

  /* ---------------- reservation dialog ---------------- */
  const dlg = $('#reserve');
  const res = { party: 4, seat: 'any' };
  const buildTimes = () => {
    const sel = $('#rTime');
    const fmt = new Intl.DateTimeFormat(locale(), { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    const keep = sel.value;
    sel.innerHTML = '';
    for (let mins = 12 * 60; mins <= 24 * 60; mins += 30) {
      const d = new Date(Date.UTC(2026, 0, 1, 0, mins % (24 * 60)));
      const v = String(Math.floor(mins / 60) % 24).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
      sel.add(new Option(fmt.format(d), v));
    }
    sel.value = keep || '20:00';
  };
  const buildSeats = () => {
    $('#seatPick').innerHTML = TP.seats.map((s) => `<button type="button" class="chip" role="radio" aria-checked="${s.id === res.seat}" aria-pressed="${s.id === res.seat}" data-seat="${s.id}">${s.key ? t(s.key) : L(s.name)}</button>`).join('');
  };
  $('#seatPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-seat]');
    if (!b) return;
    res.seat = b.dataset.seat;
    buildSeats();
    $(`#seatPick [data-seat="${res.seat}"]`).focus();
  });
  $$('.stepper [data-step]').forEach((b) => b.addEventListener('click', () => {
    res.party = clamp(res.party + +b.dataset.step, 1, 20);
    $('#party').textContent = res.party;
  }));
  const todayISO = () => {
    const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Amman' }).format(new Date());
    return d;
  };
  const openReserve = () => {
    $('#resFields').hidden = false;
    $('#resDone').hidden = true;
    $('#resError').hidden = true;
    const date = $('#rDate');
    date.min = todayISO();
    if (!date.value) date.value = todayISO();
    buildTimes(); buildSeats();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    setSheet(false);
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open="reserve"]')) { e.preventDefault(); openReserve(); }
    if (e.target.closest('[data-close]')) dlg.close();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  $('#resForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rName'), phone = $('#rPhone');
    const okName = name.value.trim().length > 1;
    const okPhone = phone.value.replace(/\D/g, '').length >= 9;
    name.setAttribute('aria-invalid', String(!okName));
    phone.setAttribute('aria-invalid', String(!okPhone));
    if (!okName || !okPhone) {
      const err = $('#resError'); err.textContent = t('res.err'); err.hidden = false;
      (okName ? phone : name).focus();
      return;
    }
    const dateStr = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date($('#rDate').value + 'T12:00:00'));
    const timeStr = $('#rTime').selectedOptions[0].textContent;
    $('#resFields').hidden = true;
    const done = $('#resDone');
    done.innerHTML = `
      <svg class="done-mark" viewBox="0 0 90 90" aria-hidden="true"><circle cx="45" cy="45" r="40"/><path d="M28 46l11 11 23-24"/></svg>
      <h3>${t('res.done')}</h3>
      <p>${t('res.doneBody', { phone: `<span dir="ltr">${phone.value.trim()}</span>`, party: res.party, date: dateStr, time: timeStr })}</p>
      <div class="done-actions"><button type="button" class="btn btn--saffron" data-close>${t('res.close')}</button></div>`;
    done.hidden = false;
    done.focus();
  });

  /* ---------------- language ---------------- */
  $('#langToggle').addEventListener('click', () => setLang(LANG === 'ar' ? 'en' : 'ar'));
  document.addEventListener('langchange', () => {
    renderSpaces(); renderMenu(); renderOpen(); renderClock(); revealRail(); reveal();
    if (dlg.open) { buildTimes(); buildSeats(); }
    if (hasGSAP()) { pinSpaces(); ScrollTrigger.refresh(); }
  });

  /* ---------------- boot ---------------- */
  renderSpaces();
  renderMenu();
  renderOpen();
  renderClock();
  setInterval(() => { renderClock(); renderOpen(); }, 30000);
  onScroll();

  const start = () => {
    if (hasGSAP()) gsap.registerPlugin(ScrollTrigger);
    hero.init();
    pinSpaces();
    if (spacesST) revealRail();
    reveal();
    filmParallax();
    if (hasGSAP()) {
      let rT;
      addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { pinSpaces(); ScrollTrigger.refresh(); }, 250); });
      document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  };
  start();
  addEventListener('load', () => { if (hasGSAP()) ScrollTrigger.refresh(); }, { once: true });
})();
