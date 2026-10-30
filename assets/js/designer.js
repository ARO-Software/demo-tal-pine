/* Tal Pine: "Design your night" prototype.
   Reads a free-text brief (English or Arabic), then builds a concept board from the venue's
   real spaces and photos: palette, floor plan, run of the night, buffet and décor. Runs fully in the browser. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const { clamp, reduced } = window.TPutil;
  let chosenMood = null;
  let lastSpec = null;

  /* ---------- vocabulary ---------- */
  const OCC = {
    wedding: { re: /wedding|marry|marriage|bride|groom|عرس|زفاف|زفّة|عروس|عريس/i, noun: { en: 'wedding', ar: 'عرس' }, g: 'm' },
    katb: { re: /katb|kitab|kateb|كتب كتاب|كتب الكتاب|عقد قران/i, noun: { en: 'katb kitab', ar: 'كتب كتاب' }, g: 'm' },
    engagement: { re: /engag|proposal|propose|خطوب|طلب اليد|طلبة/i, noun: { en: 'engagement', ar: 'خطوبة' }, g: 'f' },
    henna: { re: /henna|حن[اّ]ء|حنة|حنه/i, noun: { en: 'henna night', ar: 'ليلة حنّاء' }, g: 'f' },
    corporate: { re: /corporate|company|launch|conference|team|gala|شرك|إطلاق|اطلاق|مؤتمر|فريق/i, noun: { en: 'company dinner', ar: 'عشاء شركة' }, g: 'm' },
    birthday: { re: /birthday|party|graduat|reunion|anniversary|عيد ميلاد|تخرج|تخرّج|حفلة|ذكرى/i, noun: { en: 'private party', ar: 'حفلة خاصة' }, g: 'f' },
  };
  const MONTHS = [
    /jan|كانون الثاني|يناير/i, /feb|شباط|فبراير/i, /mar(?!r)|آذار|اذار|مارس/i, /apr|نيسان|أبريل|ابريل/i, /may|أيار|ايار|مايو/i, /jun|حزيران|يونيو/i,
    /jul|تموز|تمّوز|يوليو/i, /aug|آب|أغسطس|اغسطس/i, /sep|أيلول|ايلول|سبتمبر/i, /oct|تشرين الأول|تشرين الاول|أكتوبر|اكتوبر/i, /nov|تشرين الثاني|نوفمبر/i, /dec|كانون الأول|كانون الاول|ديسمبر/i,
  ];
  const SEASON = {
    spring: { re: /spring|ربيع/i, en: 'spring', ar: { m: 'ربيعي', f: 'ربيعية' } },
    summer: { re: /summer|صيف/i, en: 'summer', ar: { m: 'صيفي', f: 'صيفية' } },
    autumn: { re: /autumn|fall\b|خريف/i, en: 'autumn', ar: { m: 'خريفي', f: 'خريفية' } },
    winter: { re: /winter|شتاء|شتوي/i, en: 'winter', ar: { m: 'شتوي', f: 'شتوية' } },
  };
  const monthSeason = (m) => (m <= 1 || m === 11 ? 'winter' : m <= 4 ? 'spring' : m <= 8 ? 'summer' : 'autumn');
  const SPACE_AT = {
    white: { en: 'on the White Terrace', ar: 'على التراس الأبيض' },
    pines: { en: 'under the pines', ar: 'تحت الصنوبر' },
    canopies: { en: 'in the Canopies', ar: 'تحت الخيم الملوّنة' },
    cabins: { en: 'in the Cabins', ar: 'في الأكواخ' },
    lookout: { en: 'at the Lookout', ar: 'على الإطلالة' },
  };
  const MOOD_LINE = {
    whitegold: { en: 'White roses climb the chandeliers, gold catches the candlelight, and everything else stays quiet so the dress does the talking.', ar: 'ورد أبيض يلتفّ حول الثريّات، ذهبٌ يلتقط ضوء الشموع، وكل ما عدا ذلك هادئ ليتكلّم الفستان.' },
    garden: { en: 'Long tables run between the trunks under strings of warm bulbs, garden roses sit in clay jugs, and the air smells of pine all night.', ar: 'طاولات طويلة بين الجذوع تحت حبال لمبات دافئة، ورد جوري في أباريق فخّار، ورائحة الصنوبر طوال الليل.' },
    boho: { en: 'Canopies in pomegranate, saffron and teal, low cushions, brass lanterns, and a henna corner that never empties.', ar: 'خيم بلون الرمّان والزعفران والفيروز، جلسات منخفضة، فوانيس نحاس، وركن حنّاء لا يفرغ.' },
    moonlit: { en: 'Candles line the deck edge, crystal fringe chandeliers hang against the skyline, and Amman does the rest.', ar: 'شموع على حافة الجلسة، ثريّات كريستال مقابل الأفق، وعمّان تكمل المشهد.' },
    rustic: { en: 'Pine cones, wood and candlelight, wool throws on the benches and a fire pit for the last hour.', ar: 'أكواز صنوبر وخشب وضوء شموع، شالات صوف على المقاعد، وموقد نار للساعة الأخيرة.' },
  };
  const DEFAULT_MOOD = { wedding: 'whitegold', katb: 'boho', engagement: 'moonlit', henna: 'boho', corporate: 'rustic', birthday: 'rustic' };
  const RUN = {
    wedding: [['19:30', 'Guests arrive, welcome drinks', 'وصول الضيوف وضيافة الاستقبال'], ['20:30', 'Zaffa entrance', 'الزفّة ودخول العرسان'], ['20:50', 'First dance', 'الرقصة الأولى'], ['21:15', 'Dabke and open floor', 'دبكة وساحة مفتوحة'], ['22:00', 'Buffet opens', 'افتتاح البوفيه'], ['23:00', 'Cake and cold sparks', 'قطع الكيك والألعاب النارية'], ['00:30', 'Farewell', 'الوداع']],
    katb: [['17:00', 'Families arrive', 'وصول العائلتين'], ['17:30', 'The sheikh and the signing', 'الشيخ وتوقيع العقد'], ['18:00', 'Sweets and Arabic coffee', 'الحلو والقهوة العربية'], ['18:30', 'Dinner', 'العشاء'], ['19:30', 'Photos at golden hour', 'صور وقت الغروب']],
    engagement: [['19:00', 'Guests arrive', 'وصول الضيوف'], ['19:45', 'Ring exchange', 'لبس المحابس'], ['20:00', 'Sweets and toasts', 'الحلو والتهاني'], ['20:30', 'Dinner', 'العشاء'], ['21:30', 'Music and dancing', 'موسيقى ورقص'], ['23:30', 'Close', 'الختام']],
    henna: [['18:30', 'Guests arrive', 'وصول الضيوف'], ['19:00', 'Henna corner opens', 'افتتاح ركن الحنّاء'], ['19:30', 'Bride’s entrance with the tabla', 'دخول العروس على الطبلة'], ['20:30', 'Dinner', 'العشاء'], ['21:30', 'Dancing', 'رقص'], ['23:00', 'Close', 'الختام']],
    corporate: [['18:30', 'Arrival and networking', 'الوصول والتعارف'], ['19:15', 'Welcome speech', 'كلمة الترحيب'], ['19:45', 'Dinner stations open', 'افتتاح محطّات العشاء'], ['21:00', 'Live oud', 'عزف عود حيّ'], ['22:30', 'Close', 'الختام']],
    birthday: [['19:00', 'Guests arrive', 'وصول الضيوف'], ['19:30', 'Mezze and drinks', 'مقبّلات ومشروبات'], ['20:30', 'Dinner', 'العشاء'], ['21:30', 'Cake', 'الكيك'], ['22:00', 'Music', 'موسيقى'], ['23:30', 'Close', 'الختام']],
  };

  const hash = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toLatinDigits = (s) => s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  /* ---------- read the brief ---------- */
  const parse = (raw) => {
    const text = toLatinDigits(raw || '');
    let occasion = Object.keys(OCC).find((k) => OCC[k].re.test(text)) || null;
    const mood = chosenMood
      ? TP.moods.find((m) => m.id === chosenMood)
      : (() => {
          const scored = TP.moods.map((m) => ({ m, s: m.words.reduce((a, w) => a + (text.toLowerCase().includes(w) ? 1 : 0), 0) })).sort((a, b) => b.s - a.s);
          return scored[0].s > 0 ? scored[0].m : null;
        })();
    if (!occasion) occasion = mood && mood.id === 'boho' ? 'henna' : 'wedding';
    const moodFinal = mood || TP.moods.find((m) => m.id === DEFAULT_MOOD[occasion]);

    const num = text.match(/(\d{2,4})\s*(guests?|people|persons|pax|ppl|ضيف|ضيوف|شخص|أشخاص|معزوم|مدعو)/i) || text.match(/\b(\d{2,4})\b/);
    let guests = num ? +num[1] : TP.occasions.find((o) => o.id === occasion).guests;
    guests = clamp(guests, 10, 800);

    const mIdx = MONTHS.findIndex((re) => re.test(text));
    let season = Object.keys(SEASON).find((k) => SEASON[k].re.test(text));
    if (!season && mIdx >= 0) season = monthSeason(mIdx);

    let space = moodFinal.space;
    const capOf = (id) => TP.spaces.find((s) => s.id === id).cap;
    if (/pool|مسبح/i.test(text) && guests <= capOf('white')) space = 'white';
    if (/view|city|lights|إطلالة|اطلالة|المدينة/i.test(text) && guests <= capOf('lookout')) space = 'lookout';
    if (capOf(space) < guests) space = guests > capOf('pines') ? 'white' : 'pines';

    const perTable = occasion === 'corporate' ? 8 : 10;
    const tables = Math.max(2, Math.ceil(guests / perTable));
    const seed = hash(text + moodFinal.id + occasion + guests);
    return { text, occasion, mood: moodFinal, guests, season, space, tables, perTable, seed };
  };

  /* ---------- floor plan ---------- */
  const plan = (spec) => {
    const W = 600, H = 380, pad = 22;
    const sp = spec.space;
    const zones = [];
    const parts = [];
    const add = (svg, zone) => { parts.push(svg); if (zone) zones.push(zone); };
    const C = { sa: '#F0A020', ca: '#FBF3E2', ne: '#44725A', te: '#2BA5A0', ro: '#D6364B' };

    /* site features */
    if (sp === 'white') {
      add(`<rect x="${W - 150}" y="${H - 120}" width="128" height="98" rx="40" fill="${C.te}" opacity=".55"/><text x="${W - 86}" y="${H - 66}" class="pl">${t('plan.pool')}</text>`, { x: W - 162, y: H - 132, w: 152, h: 122 });
      [[60, 40], [W - 60, 40], [60, H - 40]].forEach(([x, y]) => add(`<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${C.ca}" stroke-opacity=".35" stroke-dasharray="3 4"/>`));
    }
    if (sp === 'pines' || sp === 'canopies') {
      for (let i = 0; i < 16; i++) {
        const edge = i % 4, f = ((spec.seed >> i) % 100) / 100;
        const x = edge === 0 ? pad + f * (W - 2 * pad) : edge === 1 ? W - 14 : edge === 2 ? pad + f * (W - 2 * pad) : 14;
        const y = edge === 0 ? 12 : edge === 1 ? pad + f * (H - 2 * pad) : H - 12;
        add(`<circle cx="${x.toFixed(0)}" cy="${(edge === 3 ? pad + f * (H - 2 * pad) : y).toFixed(0)}" r="${7 + (i % 3) * 2}" fill="${C.ne}" opacity=".8"/>`);
      }
    }
    if (sp === 'canopies') {
      [[90, 70], [W - 90, 70], [90, H - 70], [W - 90, H - 70]].forEach(([x, y], i) =>
        add(`<rect x="${x - 50}" y="${y - 38}" width="100" height="76" rx="8" fill="none" stroke="${[C.ro, C.sa, C.te, C.ro][i]}" stroke-width="2" stroke-dasharray="6 4"/>`));
    }
    if (sp === 'lookout') {
      add(`<path d="M${pad} ${H - 26} H${W - pad}" stroke="${C.sa}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/><text x="${W / 2}" y="${H - 8}" class="pl">${t('plan.view')}</text>`, { x: 0, y: H - 40, w: W, h: 40 });
    }
    if (sp === 'cabins') {
      for (let i = 0; i < 6; i++) add(`<path d="M${40 + i * 92} 64 l26 -22 26 22 v34 h-52z" fill="none" stroke="${[C.ro, C.sa, C.te][i % 3]}" stroke-width="2"/>`, { x: 30 + i * 92, y: 30, w: 72, h: 80 });
    }

    /* kosha, dance floor, band, buffet, entrance */
    const isParty = ['wedding', 'engagement', 'henna'].includes(spec.occasion);
    const kx = W / 2, ky = sp === 'cabins' ? 140 : 46;
    if (isParty) {
      add(`<rect x="${kx - 70}" y="${ky - 18}" width="140" height="36" rx="18" fill="${C.sa}"/><text x="${kx}" y="${ky + 5}" class="pl pl--dark">${t('plan.kosha')}</text>`, { x: kx - 82, y: ky - 26, w: 164, h: 52 });
    } else {
      add(`<rect x="${kx - 60}" y="${ky - 14}" width="120" height="28" rx="6" fill="${C.sa}"/>`, { x: kx - 70, y: ky - 22, w: 140, h: 44 });
    }
    const df = { w: Math.min(190, 70 + spec.guests * 0.25), h: Math.min(120, 46 + spec.guests * 0.14) };
    const dfx = kx - df.w / 2, dfy = ky + 32;
    add(`<rect x="${dfx}" y="${dfy}" width="${df.w}" height="${df.h}" rx="10" fill="url(#hatch)" stroke="${C.ca}" stroke-opacity=".5"/><text x="${kx}" y="${dfy + df.h / 2 + 4}" class="pl">${t('plan.dance')}</text>`, { x: dfx - 16, y: dfy - 8, w: df.w + 32, h: df.h + 24 });
    add(`<rect x="${kx + 92}" y="${ky - 12}" width="54" height="24" rx="5" fill="none" stroke="${C.ca}" stroke-opacity=".7"/><text x="${kx + 119}" y="${ky + 4}" class="pl pl--s">${t('plan.band')}</text>`, { x: kx + 84, y: ky - 20, w: 70, h: 40 });
    const bx = sp === 'white' ? 30 : W - 54;
    add(`<rect x="${bx}" y="${H / 2 - 70}" width="24" height="140" rx="6" fill="${C.ca}" opacity=".85"/><text x="${bx + 12}" y="${H / 2 + 94}" class="pl pl--s">${t('plan.buffet')}</text>`, { x: bx - 14, y: H / 2 - 80, w: 52, h: 190 });
    if (isParty) {
      const ey = sp === 'lookout' ? H - 48 : H - 14;
      add(`<path d="M${kx} ${ey} V${dfy + df.h + 8}" stroke="${C.sa}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#arr)"/><text x="${kx + 8}" y="${ey - 6}" class="pl pl--s" text-anchor="start">${t('plan.entrance')}</text>`, { x: kx - 16, y: dfy + df.h, w: 32, h: ey - dfy - df.h + 10 });
    }

    /* tables: fill the free floor on a staggered grid, nearest the dance floor first */
    const hit = (x, y, r) => zones.some((z) => x + r > z.x && x - r < z.x + z.w && y + r > z.y && y - r < z.y + z.h);
    let spacing = 46, pts = [];
    while (spacing >= 15) {
      pts = [];
      const r = spacing * 0.34;
      for (let row = 0, y = pad + r; y < H - pad - r; row++, y += spacing * 0.86) {
        for (let x = pad + r + (row % 2 ? spacing / 2 : 0); x < W - pad - r; x += spacing) {
          if (!hit(x, y, r + 3)) pts.push([x, y]);
        }
      }
      if (pts.length >= spec.tables) break;
      spacing -= 2;
    }
    const cx = kx, cy = dfy + df.h / 2;
    pts.sort((a, b) => Math.hypot(a[0] - cx, (a[1] - cy) * 1.2) - Math.hypot(b[0] - cx, (b[1] - cy) * 1.2));
    const r = Math.max(5, spacing * 0.34);
    const tablesSvg = pts.slice(0, spec.tables).map(([x, y], i) =>
      `<circle class="tbl" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="animation-delay:${(0.4 + i * Math.min(0.03, 1.4 / spec.tables)).toFixed(2)}s"/>`).join('');

    return `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('ai.plan')}: ${t('ai.tables', { t: spec.tables })}">
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="rgba(251,243,226,.04)"/><line x1="0" y1="0" x2="0" y2="8" stroke="rgba(251,243,226,.22)" stroke-width="2"/></pattern>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.sa}"/></marker>
        </defs>
        <style>
          .pl{font:500 11px 'Readex Pro',system-ui,sans-serif;fill:#FBF3E2;text-anchor:middle}
          .pl--dark{fill:#10291F}.pl--s{font-size:9.5px;opacity:.8}
          .tbl{fill:#10291F;stroke:#FBF3E2;stroke-width:1.4;transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.22,1,.36,1) both}
        </style>
        <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="18" fill="none" stroke="rgba(251,243,226,.18)"/>
        ${parts.join('')}
        ${tablesSvg}
      </svg>
      <div class="plan__legend">
        <span><i style="background:#FBF3E2"></i>${t('ai.tables', { t: spec.tables }).replace('10', spec.perTable)}</span>
        ${isParty ? `<span><i style="background:${C.sa}"></i>${t('plan.kosha')}</span>` : ''}
        <span><i style="background:transparent;box-shadow:inset 0 0 0 1.5px #FBF3E2"></i>${t('plan.dance')}</span>
      </div>`;
  };

  /* ---------- render ---------- */
  const board = $('#board');
  const show = (which) => {
    $('#boardEmpty').hidden = which !== 'empty';
    $('#boardThinking').hidden = which !== 'thinking';
    $('#boardResult').hidden = which !== 'result';
  };

  const typeInto = (el, text) => {
    if (reduced) { el.textContent = text; return; }
    el.textContent = '';
    const caret = document.createElement('span'); caret.className = 'caret';
    el.appendChild(caret);
    let i = 0;
    const tick = () => {
      i = Math.min(text.length, i + 2);
      el.firstChild && el.firstChild.nodeType === 3 ? (el.firstChild.textContent = text.slice(0, i)) : el.insertBefore(document.createTextNode(text.slice(0, i)), caret);
      if (i < text.length) setTimeout(tick, 16); else setTimeout(() => caret.remove(), 900);
    };
    tick();
  };

  const renderResult = (spec) => {
    const m = spec.mood;
    const space = TP.spaces.find((s) => s.id === spec.space);
    const names = L(m.names);
    const name = names[spec.seed % names.length];
    const occ = OCC[spec.occasion];
    const seasonWord = spec.season ? (LANG === 'ar' ? SEASON[spec.season].ar[occ.g] : SEASON[spec.season].en) : '';
    const opener = LANG === 'ar'
      ? `${occ.noun.ar}${seasonWord ? ' ' + seasonWord : ''} لـ ${spec.guests} ضيف ${SPACE_AT[spec.space].ar}.`
      : `A ${seasonWord ? seasonWord + ' ' : ''}${occ.noun.en} for ${spec.guests} guests ${SPACE_AT[spec.space].en}.`;
    const vision = `${opener} ${L(MOOD_LINE[m.id])}`;
    let imgs = m.imgs.map((n) => TP.img(n));
    if (space.id !== m.space) imgs = [space.img, ...imgs.slice(0, 2)];
    const occName = L(TP.occasions.find((o) => o.id === spec.occasion).name);
    const run = RUN[spec.occasion].map(([time, en, ar]) => `<li><time>${time}</time><span>${LANG === 'ar' ? ar : en}</span></li>`).join('');

    const el = $('#boardResult');
    el.innerHTML = `
      <div class="concept">
        <header class="concept__head">
          <div class="meta"><span>${occName}</span><span>${t('ai.guests', { n: spec.guests })}</span><span>${L(space.name)}</span><span>${L(m.name)}</span></div>
          <h3 class="concept__name">${esc(name)}</h3>
          <p class="concept__vision" id="vision"></p>
        </header>
        <div class="concept__mood">${imgs.map((src) => `<img src="${src}" alt="">`).join('')}</div>
        <div class="concept__row">
          <div>
            <h4>${t('ai.palette')}</h4>
            <div class="palette">${m.palette.map(([hex, n], i) => `<span class="swatch"><i style="background:${hex};animation-delay:${0.3 + i * 0.08}s"></i>${L(n)}</span>`).join('')}</div>
          </div>
          <div>
            <h4>${t('ai.decor')}</h4>
            <ul class="list-dots">${L(m.decor).map((d) => `<li>${d}</li>`).join('')}</ul>
          </div>
        </div>
        <div>
          <h4>${t('ai.plan')}</h4>
          <div class="plan">${plan(spec)}</div>
        </div>
        <div class="concept__row">
          <div>
            <h4>${t('ai.timeline')}</h4>
            <ol class="timeline">${run}</ol>
          </div>
          <div>
            <h4>${t('ai.menu')}</h4>
            <ul class="list-dots">${L(TP.buffets).map((d) => `<li>${d}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="concept__cta">
          <button type="button" class="btn btn--saffron" id="sendConcept">${t('ai.send')}</button>
          <button type="button" class="btn btn--line" id="againConcept">${t('ai.again')}</button>
        </div>
        <p class="concept__fine">${t('ai.fine')}</p>
      </div>`;
    show('result');
    typeInto($('#vision'), vision);
    lastSpec = { ...spec, name };
  };

  const think = (spec) => new Promise((resolve) => {
    const steps = [t('ai.think1'), t('ai.think2', { n: spec.guests }), t('ai.think3', { t: spec.tables }), t('ai.think4'), t('ai.think5'), t('ai.think6')];
    const ul = $('#thinkSteps');
    ul.innerHTML = '';
    show('thinking');
    const gap = reduced ? 60 : 430;
    steps.forEach((s, i) => setTimeout(() => {
      if (ul.lastElementChild) ul.lastElementChild.classList.add('is-done');
      const li = document.createElement('li'); li.textContent = s; ul.appendChild(li);
      if (i === steps.length - 1) setTimeout(() => { li.classList.add('is-done'); setTimeout(resolve, gap * 0.6); }, gap);
    }, i * gap));
  });

  /* ---------- wiring ---------- */
  const renderChips = () => {
    $('#moodChips').innerHTML = TP.moods.map((m) => `
      <button type="button" class="chip" aria-pressed="${chosenMood === m.id}" data-mood="${m.id}">
        <span class="sw" aria-hidden="true">${m.palette.slice(0, 3).map(([hex]) => `<i style="background:${hex}"></i>`).join('')}</span>${L(m.name)}
      </button>`).join('');
  };
  $('#moodChips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mood]');
    if (!b) return;
    chosenMood = chosenMood === b.dataset.mood ? null : b.dataset.mood;
    renderChips();
    $(`#moodChips [data-mood="${b.dataset.mood}"]`).focus();
  });

  let busy = false;
  $('#brief').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const ta = $('#briefText');
    const text = ta.value.trim() || (chosenMood ? '' : ta.placeholder);
    const spec = parse(text);
    busy = true;
    const btn = $('#designBtn');
    btn.classList.add('is-busy');
    btn.querySelector('span').textContent = t('ai.going');
    if (innerWidth < 980) board.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    await think(spec);
    renderResult(spec);
    btn.classList.remove('is-busy');
    btn.querySelector('span').textContent = t('ai.go');
    busy = false;
  });

  board.addEventListener('click', (e) => {
    if (e.target.closest('#againConcept')) {
      $('#briefText').focus();
      $('#brief').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
    if (e.target.closest('#sendConcept') && lastSpec && window.Wizard) {
      const s = lastSpec;
      const palette = s.mood.palette.map(([, n]) => L(n)).join(LANG === 'ar' ? '، ' : ', ');
      const notes = LANG === 'ar'
        ? `فكرة من "صمّم ليلتك": ${s.name}. المزاج: ${L(s.mood.name)}. الألوان: ${palette}.`
        : `From "Design your night": ${s.name}. Mood: ${L(s.mood.name)}. Palette: ${palette}.`;
      window.Wizard.prefill({ occasion: s.occasion, guests: s.guests, space: s.space, notes });
      document.getElementById('weddings').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });

  document.addEventListener('langchange', () => {
    renderChips();
    if (lastSpec && !$('#boardResult').hidden) {
      const spec = parse(lastSpec.text);
      renderResult(spec);
    }
  });
  renderChips();
})();
