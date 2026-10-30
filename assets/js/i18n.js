/* Tal Pine: UI strings in English and Arabic.
   HTML uses data-i18n / data-i18n-ph; scripts call t('key', {vars}). */
(function () {
  const en = {
    'skip': 'Skip to content',
    'nav.hill': 'The hill', 'nav.spaces': 'Spaces', 'nav.menu': 'Menu', 'nav.weddings': 'Weddings',
    'nav.designer': 'Design your night', 'nav.visit': 'Visit', 'nav.open': 'Open menu', 'nav.close': 'Close menu',
    'lang.switch': 'عربي',
    'cta.book': 'Book a table', 'cta.wedding': 'Plan your wedding',

    'hero.where': 'Airport Road, Amman',
    'hero.l1': 'Long lunches under the pines.',
    'hero.l2': 'Weddings under the chandeliers.',
    'hero.hours': 'Open every day, 12 pm to 1 am',
    'hero.openNow': 'Open now, until 1 am',
    'hero.opensAt': 'Opens today at 12 pm',
    'hero.tagline': 'From the scent of the pines, a taste and a place renewed in every season.',

    'hill.title': 'One hill, two moods',
    'hill.day': 'By day', 'hill.night': 'By night',
    'hill.clockDay': 'It’s {time} on the hill. Lunch is on.',
    'hill.clockNight': 'It’s {time} on the hill. The lights are on.',
    'hill.dayCopy': 'From noon the hill is for long lunches: tables in the shade of the pines, canopies in every color, a waterfall you hear before you see it, and room for the kids to run.',
    'hill.d1': 'Kitchen opens at 12 pm', 'hill.d2': 'Play area for kids', 'hill.d3': 'Shaded and covered seating',
    'hill.nightCopy': 'After sunset Amman lights up below you. The cabins glow, the chandeliers come on, and from Wednesday to Friday there is live oud and qanun.',
    'hill.n1': 'Open until 1 am', 'hill.n2': 'Live music, Wednesday to Friday', 'hill.n3': 'Decks facing the city lights',

    'spaces.title': 'Find your corner of the hill',
    'spaces.lead': 'Every space serves lunch, and each one becomes an event venue after dark.',
    'space.plan': 'Plan an event here',

    'menu.title': 'From the kitchen',
    'menu.lead': 'Jordanian and Levantine cooking: clay pots from the oven, coals lit at the table, sweets made that morning.',
    'menu.alsoTitle': 'Also on the table',
    'menu.call': 'Call for today’s full menu',

    'wed.title': 'Weddings on the hill',
    'wed.lead': 'From a katb kitab under the canopies to 700 guests on the White Terrace. Check a date, choose a space and send your request. Our events team calls you back within a day.',
    'wiz.s1': 'Occasion', 'wiz.s2': 'Date and guests', 'wiz.s3': 'Space and package', 'wiz.s4': 'Your details',
    'wiz.q1': 'What are you celebrating?', 'wiz.q2': 'Pick a date', 'wiz.q3': 'Choose a space', 'wiz.q4': 'Where can we reach you?',
    'wiz.guests': 'Guests', 'wiz.slot': 'Time', 'wiz.afternoon': 'Afternoon', 'wiz.evening': 'Evening',
    'wiz.package': 'Package', 'wiz.addons': 'Add-ons',
    'wiz.back': 'Back', 'wiz.next': 'Continue', 'wiz.send': 'Send on WhatsApp',
    'cal.open': 'Available', 'cal.few': 'One slot left', 'cal.full': 'Booked',
    'cal.prev': 'Previous month', 'cal.next': 'Next month',
    'fit.ok': 'Fits {n} guests', 'fit.no': 'Up to {cap} guests', 'fit.best': 'Best fit',
    'err.occasion': 'Choose what you’re celebrating to continue.',
    'err.date': 'Pick an available date to continue.',
    'err.space': 'Choose a space that fits your guests to continue.',
    'err.contact': 'Add your name and a mobile number so we can call you back.',
    'sum.title': 'Your request', 'sum.occasion': 'Occasion', 'sum.date': 'Date', 'sum.guests': 'Guests',
    'sum.space': 'Space', 'sum.package': 'Package', 'sum.addons': 'Add-ons', 'sum.empty': 'Not chosen yet', 'sum.none': 'None',
    'sum.note': 'No payment now. Your request opens in WhatsApp, then we confirm availability and send a quote.',
    'done.title': 'Your request is ready in WhatsApp',
    'done.body': 'Tap send in WhatsApp to deliver it to our events team, {name}. We’ll call {phone} within a day to confirm {date} and send your quote.',
    'done.ref': 'Reference {ref}', 'done.ics': 'Add to calendar', 'done.call': 'Call us now', 'done.again': 'Plan another event',
    'f.name': 'Your name', 'f.phone': 'Mobile number', 'f.email': 'Email (optional)', 'f.notes': 'Anything we should know?',
    'f.notesPh': 'Names, theme, dietary needs…',

    'ai.tag': 'AI prototype',
    'ai.title': 'Design your night',
    'ai.lead': 'Describe the night you have in mind. The planner picks a space, lays out the tables, suggests a palette and drafts the evening, then hands it to our events team.',
    'ai.label': 'Your idea',
    'ai.ph': 'A white and gold wedding for 350 guests in June. Elegant but warm, a zaffa entrance and a view of the city.',
    'ai.try': 'Or start from a mood:',
    'ai.go': 'Design my night', 'ai.going': 'Designing…',
    'ai.empty': 'Your concept board will appear here: space, floor plan, palette and the run of the night.',
    'ai.think1': 'Reading your brief', 'ai.think2': 'Choosing a space for {n} guests', 'ai.think3': 'Laying out {t} tables',
    'ai.think4': 'Picking a palette', 'ai.think5': 'Drafting the run of the night', 'ai.think6': 'Matching the buffet',
    'ai.palette': 'Palette', 'ai.plan': 'Floor plan', 'ai.timeline': 'The night', 'ai.menu': 'Buffet', 'ai.decor': 'Décor',
    'ai.send': 'Send this concept to our events team', 'ai.again': 'Try another idea',
    'ai.fine': 'Prototype: concepts are generated in your browser from Tal Pine’s real spaces and photos.',
    'ai.guests': '{n} guests', 'ai.tables': '{t} tables of 10',
    'plan.kosha': 'Kosha', 'plan.dance': 'Dance floor', 'plan.tables': 'Guest tables', 'plan.buffet': 'Buffet',
    'plan.band': 'Band', 'plan.entrance': 'Zaffa entrance', 'plan.pool': 'Pool', 'plan.view': 'City view',

    'visit.title': 'Come up the hill',
    'visit.where': 'Where', 'visit.address': 'Airport Road, Abdoun corridor, Amman',
    'visit.when': 'Hours', 'visit.hours': 'Every day, 12 pm to 1 am',
    'visit.music': 'Live music', 'visit.musicTimes': 'Wednesday to Friday evenings',
    'visit.call': 'Reservations', 'visit.email': 'Events',
    'visit.directions': 'Get directions',
    'foot.group': 'Tal Pine is part of TAL Group.',
    'foot.copy': '© 2026 Tal Pine.', 'foot.by': 'Website concept by ARO Solutions.',
    'dock.call': 'Call',

    'res.title': 'Book a table',
    'res.lead': 'We hold tables for 15 minutes. For groups over 20, plan an event instead.',
    'res.date': 'Date', 'res.time': 'Time', 'res.party': 'Guests', 'res.seat': 'Where would you like to sit?',
    'res.submit': 'Request on WhatsApp', 'res.any': 'No preference',
    'res.err': 'Add your name and a mobile number so we can confirm.',
    'res.done': 'Your table request is ready in WhatsApp',
    'res.doneBody': 'Tap send in WhatsApp and we’ll confirm a table for {party} on {date} at {time}.',
    'res.close': 'Done',

    'wa.open': 'Open WhatsApp', 'visit.wa': 'WhatsApp', 'visit.waText': 'Message us', 'dock.wa': 'WhatsApp',
    'msg.hello': 'Hello Tal Pine,', 'msg.event': 'New event request', 'msg.table': 'Table request',
    'msg.name': 'Name', 'msg.mobile': 'Mobile', 'msg.email': 'Email', 'msg.notes': 'Notes', 'msg.time': 'Time', 'msg.seat': 'Seating',
    'msg.footer': 'Sent from the Tal Pine website', 'msg.hi': 'Hello Tal Pine, I have a question.',
  };

  const ar = {
    'skip': 'انتقل إلى المحتوى',
    'nav.hill': 'التلّة', 'nav.spaces': 'المساحات', 'nav.menu': 'المنيو', 'nav.weddings': 'الأعراس',
    'nav.designer': 'صمّم ليلتك', 'nav.visit': 'زورونا', 'nav.open': 'افتح القائمة', 'nav.close': 'أغلق القائمة',
    'lang.switch': 'English',
    'cta.book': 'احجز طاولة', 'cta.wedding': 'خطّط لعرسك',

    'hero.where': 'عمّان، طريق المطار',
    'hero.l1': 'غداءٌ طويل تحت الصنوبر.',
    'hero.l2': 'وأعراسٌ تحت الثريّات.',
    'hero.hours': 'مفتوح يومياً من 12 ظهراً حتى 1 بعد منتصف الليل',
    'hero.openNow': 'مفتوح الآن حتى 1 بعد منتصف الليل',
    'hero.opensAt': 'نفتح اليوم الساعة 12 ظهراً',
    'hero.tagline': '',

    'hill.title': 'تلّة واحدة ومزاجان',
    'hill.day': 'نهاراً', 'hill.night': 'ليلاً',
    'hill.clockDay': 'الساعة {time} على التلّة، والغداء جاهز.',
    'hill.clockNight': 'الساعة {time} على التلّة، والأضواء مشتعلة.',
    'hill.dayCopy': 'من الظهر، التلّة للغداء الطويل: طاولات في ظلّ الصنوبر، خيم بكل الألوان، شلّال تسمعه قبل أن تراه، ومساحة يركض فيها الأطفال.',
    'hill.d1': 'المطبخ يفتح الساعة 12 ظهراً', 'hill.d2': 'منطقة ألعاب للأطفال', 'hill.d3': 'جلسات مظلّلة ومغطّاة',
    'hill.nightCopy': 'بعد الغروب تضيء عمّان تحتك. تتوهّج الأكواخ، تشتعل الثريّات، ومن الأربعاء حتى الجمعة عزفٌ حيّ على العود والقانون.',
    'hill.n1': 'مفتوح حتى 1 بعد منتصف الليل', 'hill.n2': 'موسيقى حيّة من الأربعاء حتى الجمعة', 'hill.n3': 'جلسات مطلّة على أضواء المدينة',

    'spaces.title': 'اختر زاويتك من التلّة',
    'spaces.lead': 'كل مساحة تستقبلكم على الغداء، وتتحوّل بعد المغرب إلى قاعة مناسبات.',
    'space.plan': 'خطّط لمناسبتك هنا',

    'menu.title': 'من مطبخنا',
    'menu.lead': 'طبخ أردني وشامي: فخّار من الفرن، فحمٌ يُشعل على الطاولة، وحلو محضّر من الصبح.',
    'menu.alsoTitle': 'وعلى الطاولة أيضاً',
    'menu.call': 'اتصل لمعرفة منيو اليوم كاملاً',

    'wed.title': 'أعراس الصنوبر',
    'wed.lead': 'من كتب كتاب تحت الخيم الملوّنة إلى عرسٍ لـ 700 ضيف على التراس الأبيض. اختر التاريخ والمساحة وأرسل طلبك، وفريق المناسبات يتصل بك خلال يوم.',
    'wiz.s1': 'المناسبة', 'wiz.s2': 'التاريخ والضيوف', 'wiz.s3': 'المساحة والباقة', 'wiz.s4': 'بياناتك',
    'wiz.q1': 'شو المناسبة؟', 'wiz.q2': 'اختر التاريخ', 'wiz.q3': 'اختر المساحة', 'wiz.q4': 'كيف نتواصل معك؟',
    'wiz.guests': 'عدد الضيوف', 'wiz.slot': 'الوقت', 'wiz.afternoon': 'عصراً', 'wiz.evening': 'مساءً',
    'wiz.package': 'الباقة', 'wiz.addons': 'إضافات',
    'wiz.back': 'رجوع', 'wiz.next': 'متابعة', 'wiz.send': 'أرسل عبر واتساب',
    'cal.open': 'متاح', 'cal.few': 'موعد واحد متبقٍّ', 'cal.full': 'محجوز',
    'cal.prev': 'الشهر السابق', 'cal.next': 'الشهر التالي',
    'fit.ok': 'تتّسع لـ {n} ضيف', 'fit.no': 'حتى {cap} ضيف فقط', 'fit.best': 'الأنسب',
    'err.occasion': 'اختر المناسبة لتتابع.',
    'err.date': 'اختر تاريخاً متاحاً لتتابع.',
    'err.space': 'اختر مساحة تتّسع لضيوفك لتتابع.',
    'err.contact': 'أضف اسمك ورقم الموبايل لنتصل بك.',
    'sum.title': 'طلبك', 'sum.occasion': 'المناسبة', 'sum.date': 'التاريخ', 'sum.guests': 'الضيوف',
    'sum.space': 'المساحة', 'sum.package': 'الباقة', 'sum.addons': 'الإضافات', 'sum.empty': 'لم يُحدَّد بعد', 'sum.none': 'لا يوجد',
    'sum.note': 'لا دفع الآن. يُفتح طلبك في واتساب، ثم نؤكّد التوفّر ونرسل عرض السعر.',
    'done.title': 'طلبك جاهز في واتساب',
    'done.body': 'اضغط إرسال في واتساب ليصل طلبك لفريق المناسبات يا {name}. سنتصل على {phone} خلال يوم لتأكيد {date} وإرسال عرض السعر.',
    'done.ref': 'رقم الطلب {ref}', 'done.ics': 'أضف إلى التقويم', 'done.call': 'اتصل بنا الآن', 'done.again': 'خطّط لمناسبة أخرى',
    'f.name': 'الاسم', 'f.phone': 'رقم الموبايل', 'f.email': 'البريد الإلكتروني (اختياري)', 'f.notes': 'شي لازم نعرفه؟',
    'f.notesPh': 'الأسماء، الثيم، أي حساسية طعام…',

    'ai.tag': 'نموذج تجريبي بالذكاء الاصطناعي',
    'ai.title': 'صمّم ليلتك',
    'ai.lead': 'احكِ لنا عن الليلة اللي ببالك. المخطّط يختار المساحة، يرتّب الطاولات، يقترح الألوان ويكتب برنامج السهرة، ثم يرسلها لفريق المناسبات.',
    'ai.label': 'فكرتك',
    'ai.ph': 'عرس أبيض وذهبي لـ 350 ضيف في حزيران. أنيق ودافئ، مع زفّة وإطلالة على المدينة.',
    'ai.try': 'أو ابدأ من مزاج:',
    'ai.go': 'صمّم ليلتي', 'ai.going': 'جاري التصميم…',
    'ai.empty': 'لوحة الفكرة ستظهر هنا: المساحة، مخطّط الطاولات، الألوان وبرنامج السهرة.',
    'ai.think1': 'نقرأ فكرتك', 'ai.think2': 'نختار مساحة لـ {n} ضيف', 'ai.think3': 'نرتّب {t} طاولة',
    'ai.think4': 'نختار الألوان', 'ai.think5': 'نكتب برنامج السهرة', 'ai.think6': 'ننسّق البوفيه',
    'ai.palette': 'الألوان', 'ai.plan': 'مخطّط القاعة', 'ai.timeline': 'برنامج السهرة', 'ai.menu': 'البوفيه', 'ai.decor': 'الديكور',
    'ai.send': 'أرسل الفكرة لفريق المناسبات', 'ai.again': 'جرّب فكرة أخرى',
    'ai.fine': 'نموذج تجريبي: الأفكار تُولَّد في متصفحك من مساحات وصور تل الصنوبر الحقيقية.',
    'ai.guests': '{n} ضيف', 'ai.tables': '{t} طاولة لعشرة أشخاص',
    'plan.kosha': 'الكوشة', 'plan.dance': 'ساحة الرقص', 'plan.tables': 'طاولات الضيوف', 'plan.buffet': 'البوفيه',
    'plan.band': 'الفرقة', 'plan.entrance': 'مدخل الزفّة', 'plan.pool': 'المسبح', 'plan.view': 'إطلالة المدينة',

    'visit.title': 'اطلع على التلّة',
    'visit.where': 'الموقع', 'visit.address': 'عمّان، طريق المطار، كوريدور عبدون',
    'visit.when': 'الدوام', 'visit.hours': 'يومياً من 12 ظهراً حتى 1 بعد منتصف الليل',
    'visit.music': 'موسيقى حيّة', 'visit.musicTimes': 'مساء الأربعاء حتى الجمعة',
    'visit.call': 'الحجوزات', 'visit.email': 'المناسبات',
    'visit.directions': 'الاتجاهات على الخريطة',
    'foot.group': 'تل الصنوبر جزء من مجموعة TAL.',
    'foot.copy': '© 2026 تل الصنوبر.', 'foot.by': 'تصميم الموقع: ARO Solutions.',
    'dock.call': 'اتصل',

    'res.title': 'احجز طاولة',
    'res.lead': 'نحجز الطاولة لمدة 15 دقيقة. للمجموعات فوق 20 شخص، خطّط لمناسبة.',
    'res.date': 'التاريخ', 'res.time': 'الساعة', 'res.party': 'عدد الأشخاص', 'res.seat': 'وين حابب تقعد؟',
    'res.submit': 'اطلب عبر واتساب', 'res.any': 'بدون تفضيل',
    'res.err': 'أضف اسمك ورقم الموبايل لنؤكّد الحجز.',
    'res.done': 'طلب الحجز جاهز في واتساب',
    'res.doneBody': 'اضغط إرسال في واتساب وسنؤكّد طاولة لـ {party} يوم {date} الساعة {time}.',
    'res.close': 'تمام',

    'wa.open': 'افتح واتساب', 'visit.wa': 'واتساب', 'visit.waText': 'راسلنا', 'dock.wa': 'واتساب',
    'msg.hello': 'مرحباً تل الصنوبر،', 'msg.event': 'طلب مناسبة جديد', 'msg.table': 'طلب حجز طاولة',
    'msg.name': 'الاسم', 'msg.mobile': 'الموبايل', 'msg.email': 'البريد', 'msg.notes': 'ملاحظات', 'msg.time': 'الساعة', 'msg.seat': 'الجلسة',
    'msg.footer': 'أُرسل من موقع تل الصنوبر', 'msg.hi': 'مرحباً تل الصنوبر، عندي استفسار.',
  };

  const dict = { en, ar };
  const pick = () => {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'ar' || q === 'en') return q;
      const saved = localStorage.getItem('talpine.lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) { /* storage blocked */ }
    return (navigator.language || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  };

  window.LANG = pick();
  window.t = (key, vars) => {
    let s = (dict[window.LANG] && dict[window.LANG][key]);
    if (s === undefined) s = en[key] !== undefined ? en[key] : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
    return s;
  };
  /* pick a localized field from data objects: {en:'..', ar:'..'} */
  window.L = (obj) => (obj && typeof obj === 'object' ? (obj[window.LANG] || obj.en) : obj);
  window.locale = () => (window.LANG === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB');

  window.applyI18n = () => {
    const html = document.documentElement;
    html.lang = window.LANG;
    html.dir = window.LANG === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = window.t(el.dataset.i18n);
      if (v !== '' || window.LANG === 'en') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = window.t(el.dataset.i18nPh); });
    document.title = window.LANG === 'ar' ? 'تل الصنوبر | Tal Pine' : 'Tal Pine | تل الصنوبر';
  };

  window.setLang = (lang) => {
    window.LANG = lang;
    try { localStorage.setItem('talpine.lang', lang); } catch (e) { /* ignore */ }
    window.applyI18n();
    document.dispatchEvent(new CustomEvent('langchange'));
  };
})();
