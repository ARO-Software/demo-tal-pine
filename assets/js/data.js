/* Tal Pine: venue content. Capacities, menu lines and packages are demo values to confirm with the venue. */
window.TP = (function () {
  const img = (n) => `assets/img/${n}.webp`;

  const spaces = [
    {
      id: 'white', cap: 700, min: 120, img: img('v-dome'), alt: { en: 'White dome pavilion with a chandelier, lit in violet at night', ar: 'قبّة بيضاء بثريّا مضاءة ليلاً' },
      name: { en: 'The White Terrace', ar: 'التراس الأبيض' },
      desc: { en: 'Chandelier domes, white columns and a lit pool. Built for weddings.', ar: 'قباب بثريّات، أعمدة بيضاء ومسبح مضاء. مصمّم للأعراس.' },
      capText: { en: 'Weddings up to 700', ar: 'أعراس حتى 700 ضيف' },
      events: ['wedding', 'engagement', 'corporate'], plan: 'pool',
    },
    {
      id: 'pines', cap: 250, min: 30, img: img('day-forest-walk'), alt: { en: 'Stone path between pine trunks lined with wooden booths', ar: 'ممرّ حجري بين جذوع الصنوبر' },
      name: { en: 'Under the Pines', ar: 'تحت الصنوبر' },
      desc: { en: 'Stone paths and long tables between the trunks. Our everyday dining room.', ar: 'ممرّات حجرية وطاولات طويلة بين الجذوع. صالتنا اليومية.' },
      capText: { en: 'Up to 250 guests', ar: 'حتى 250 ضيف' },
      events: ['katb', 'henna', 'birthday', 'corporate', 'engagement'], plan: 'forest',
    },
    {
      id: 'canopies', cap: 80, min: 10, img: img('day-canopies'), alt: { en: 'Colored fabric canopies over a wooden dining deck', ar: 'خيم قماشية ملوّنة فوق جلسة خشبية' },
      name: { en: 'The Canopies', ar: 'الخيم الملوّنة' },
      desc: { en: 'Fabric pavilions in red, saffron and teal. Made for family lunches and katb kitab.', ar: 'خيم قماشية بالأحمر والزعفراني والفيروزي. للغداء العائلي وكتب الكتاب.' },
      capText: { en: '10 to 80 guests', ar: 'من 10 إلى 80 ضيف' },
      events: ['katb', 'henna', 'birthday'], plan: 'canopy',
    },
    {
      id: 'cabins', cap: 40, min: 4, img: img('night-cabins-color'), alt: { en: 'Painted cabins lit up at night behind red flowers', ar: 'أكواخ ملوّنة مضاءة ليلاً' },
      name: { en: 'The Cabins', ar: 'الأكواخ' },
      desc: { en: 'Private painted cabins for six to ten, lit up at night. Book one or the whole row.', ar: 'أكواخ خاصة ملوّنة تتّسع من 6 إلى 10، مضاءة ليلاً. احجز كوخاً أو الصف كاملاً.' },
      capText: { en: '6 to 10 per cabin', ar: 'من 6 إلى 10 في الكوخ' },
      events: ['birthday', 'engagement'], plan: 'cabins',
    },
    {
      id: 'lookout', cap: 120, min: 2, img: img('night-aframe-view'), alt: { en: 'Wooden A-frame deck facing the lights of Amman', ar: 'جلسة خشبية مطلّة على أضواء عمّان' },
      name: { en: 'The Lookout', ar: 'الإطلالة' },
      desc: { en: 'A-frame decks facing Amman’s lights. Engagements, proposals and sunset dinners.', ar: 'جلسات خشبية تطلّ على أضواء عمّان. للخطوبة وطلب اليد وعشاء الغروب.' },
      capText: { en: 'Up to 120 guests', ar: 'حتى 120 ضيف' },
      events: ['engagement', 'birthday', 'corporate'], plan: 'view',
    },
  ];

  const dishes = [
    { img: img('food-waraq'), name: { en: 'Warak enab bil fukhar', ar: 'ورق عنب بالفخّار' }, alt: { en: 'ورق عنب بالفخّار', ar: 'Vine leaves in clay' },
      desc: { en: 'Vine leaves rolled by hand and slow-cooked in a clay pot.', ar: 'ورق عنب ملفوف باليد ومطبوخ على مهل في الفخّار.' } },
    { img: img('food-coals'), name: { en: 'Malaneh on the coals', ar: 'ملّانة على الفحم' }, alt: { en: 'ملّانة على الفحم', ar: 'Green chickpeas on coals' },
      desc: { en: 'Green chickpeas roasted over live coals, in season.', ar: 'حمّص أخضر مشويّ على الفحم، في موسمه.' } },
    { img: img('food-qashta'), name: { en: 'Qashta with honey', ar: 'قشطة بالعسل' }, alt: { en: 'قشطة بالعسل', ar: 'Cream with honey' },
      desc: { en: 'Fresh cream layered with crushed pistachio, honey on the side.', ar: 'قشطة طازجة بطبقات الفستق الحلبي، والعسل على الجانب.' } },
    { img: img('food-fruit'), name: { en: 'The fruit table', ar: 'سفرة الفواكه' }, alt: { en: 'سفرة الفواكه', ar: 'Fruit table' },
      desc: { en: 'Whatever the market had best that morning, piled high.', ar: 'أطيب ما في السوق ذاك الصباح.' } },
  ];

  const also = [
    { name: { en: 'Fattet hummus', ar: 'فتّة حمّص' }, desc: { en: 'Warm chickpeas, yogurt, toasted bread and pine nuts.', ar: 'حمّص دافئ ولبن وخبز محمّص وصنوبر.' } },
    { name: { en: 'Mixed grill', ar: 'مشاوي مشكّلة' }, desc: { en: 'Kebab, shish tawook and lamb chops off the charcoal.', ar: 'كباب وشيش طاووق وريش من على الفحم.' } },
    { name: { en: 'Lamb fukhara', ar: 'فخّارة لحمة' }, desc: { en: 'Lamb and vegetables baked in a sealed clay pot.', ar: 'لحم وخضار مخبوزة في فخّارة مغلقة.' } },
    { name: { en: 'Mezze for the table', ar: 'مقبّلات للطاولة' }, desc: { en: 'Hummus, mutabbal, fattoush, vine leaves and fresh bread.', ar: 'حمّص، متبّل، فتّوش، ورق عنب وخبز طازج.' } },
    { name: { en: 'Kunafa', ar: 'كنافة' }, desc: { en: 'Hot from the tray with Nabulsi cheese.', ar: 'سخنة من الصينية بالجبنة النابلسية.' } },
    { name: { en: 'Argileh and tea', ar: 'أرجيلة وشاي' }, desc: { en: 'For the long evenings on the decks.', ar: 'للسهرات الطويلة على الجلسات.' } },
  ];

  const icon = {
    wedding: '<svg viewBox="0 0 32 32"><circle cx="12" cy="19" r="7"/><circle cx="20" cy="19" r="7"/><path d="M14 6l2-3 2 3-2 2z"/></svg>',
    katb: '<svg viewBox="0 0 32 32"><path d="M8 5h13l4 4v18H8z"/><path d="M21 5v4h4M12 14h9M12 18h9M12 22h5"/></svg>',
    engagement: '<svg viewBox="0 0 32 32"><circle cx="16" cy="20" r="8"/><path d="M12 8l4-4 4 4-4 4z"/></svg>',
    henna: '<svg viewBox="0 0 32 32"><path d="M11 28V14a2 2 0 0 1 4 0v-4a2 2 0 0 1 4 0v4a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-4-6a2 2 0 0 1 3-2l1 1"/><circle cx="17" cy="19" r="1.5"/></svg>',
    corporate: '<svg viewBox="0 0 32 32"><rect x="5" y="10" width="22" height="16" rx="2"/><path d="M12 10V7h8v3M5 17h22"/></svg>',
    birthday: '<svg viewBox="0 0 32 32"><path d="M6 27h20M8 27V17h16v10M11 17v-4M16 17v-4M21 17v-4"/><path d="M11 10c-1-1 0-3 0-3s1 2 0 3zM16 10c-1-1 0-3 0-3s1 2 0 3zM21 10c-1-1 0-3 0-3s1 2 0 3z"/></svg>',
  };

  const occasions = [
    { id: 'wedding', guests: 350, name: { en: 'Wedding', ar: 'عرس' }, sub: { en: 'The full night, zaffa to last dance', ar: 'الليلة كاملة من الزفّة لآخر رقصة' } },
    { id: 'katb', guests: 60, name: { en: 'Katb kitab', ar: 'كتب كتاب' }, sub: { en: 'Intimate, for the families', ar: 'جلسة عائلية خاصة' } },
    { id: 'engagement', guests: 120, name: { en: 'Engagement', ar: 'خطوبة' }, sub: { en: 'Rings, sweets and the city lights', ar: 'محابس وحلو وأضواء المدينة' } },
    { id: 'henna', guests: 100, name: { en: 'Henna night', ar: 'ليلة حنّاء' }, sub: { en: 'Under the canopies, all color', ar: 'تحت الخيم وكلّها ألوان' } },
    { id: 'corporate', guests: 150, name: { en: 'Corporate', ar: 'شركات' }, sub: { en: 'Dinners, launches, team days', ar: 'عشاء، إطلاق منتج، يوم للفريق' } },
    { id: 'birthday', guests: 30, name: { en: 'Private party', ar: 'مناسبة خاصة' }, sub: { en: 'Birthdays, graduations, reunions', ar: 'أعياد ميلاد، تخرّج، لمّة' } },
  ].map((o) => ({ ...o, icon: icon[o.id] }));

  const packages = [
    { id: 'essential', name: { en: 'Essential', ar: 'الأساسية' },
      items: { en: ['Set menu or open buffet', 'Venue lighting and sound', 'Soft drinks and water'], ar: ['منيو ثابت أو بوفيه مفتوح', 'إضاءة وصوت القاعة', 'مشروبات غازية ومياه'] } },
    { id: 'signature', name: { en: 'Signature', ar: 'المميّزة' }, badge: true,
      items: { en: ['Live stations and grill', 'Kosha and floral styling', 'Welcome drinks and sweets'], ar: ['محطّات حيّة ومشاوي', 'كوشة وتنسيق ورد', 'ضيافة استقبال وحلو'] } },
    { id: 'grand', name: { en: 'Grand', ar: 'الفاخرة' },
      items: { en: ['Everything in Signature', 'Zaffa band and DJ', 'Cold sparks and photography'], ar: ['كل ما في المميّزة', 'فرقة زفّة ودي جي', 'ألعاب نارية باردة وتصوير'] } },
  ];

  const addons = [
    { id: 'zaffa', name: { en: 'Zaffa band', ar: 'فرقة زفّة' } },
    { id: 'dj', name: { en: 'DJ', ar: 'دي جي' } },
    { id: 'oud', name: { en: 'Live oud', ar: 'عود حيّ' } },
    { id: 'sparks', name: { en: 'Cold sparks', ar: 'ألعاب نارية باردة' } },
    { id: 'flowers', name: { en: 'Flower arch', ar: 'قوس ورد' } },
    { id: 'photo', name: { en: 'Photographer', ar: 'تصوير' } },
    { id: 'valet', name: { en: 'Valet parking', ar: 'صفّ سيارات' } },
  ];

  const seats = [
    { id: 'any', key: 'res.any' },
    { id: 'pines', name: { en: 'Under the pines', ar: 'تحت الصنوبر' } },
    { id: 'canopies', name: { en: 'Canopies', ar: 'الخيم' } },
    { id: 'cabins', name: { en: 'A cabin', ar: 'كوخ' } },
    { id: 'lookout', name: { en: 'The lookout', ar: 'الإطلالة' } },
  ];

  /* moods drive the AI designer */
  const moods = [
    {
      id: 'whitegold', name: { en: 'White and gold', ar: 'أبيض وذهبي' }, space: 'white',
      words: ['white', 'gold', 'chandelier', 'classic', 'elegant', 'royal', 'أبيض', 'ذهبي', 'ثريا', 'ثريّا', 'كلاسيك', 'أنيق', 'فخم'],
      palette: [['#FBF8F1', { en: 'Pearl', ar: 'لؤلؤي' }], ['#E9DCC0', { en: 'Champagne', ar: 'شمبانيا' }], ['#C9A24A', { en: 'Old gold', ar: 'ذهبي عتيق' }], ['#8C7A5B', { en: 'Bronze', ar: 'برونزي' }], ['#10291F', { en: 'Pine', ar: 'صنوبري' }]],
      imgs: ['v-chandelier-arch', 'v-dome-up', 'v-round-table'],
      names: { en: ['Under the Crystal Domes', 'A Night of Pearl and Gold', 'The Chandelier Hour'], ar: ['تحت قباب الكريستال', 'ليلة اللؤلؤ والذهب', 'ساعة الثريّات'] },
      decor: { en: ['Crystal chandeliers dressed in white roses', 'Gold-rim chargers and candle clusters', 'Pearl-white kosha framed by the domes', 'Floating candles on the pool'], ar: ['ثريّات كريستال مزيّنة بالورد الأبيض', 'صحون بحواف ذهبية وشموع متجمّعة', 'كوشة بيضاء بين القباب', 'شموع عائمة على المسبح'] },
    },
    {
      id: 'garden', name: { en: 'Garden romance', ar: 'رومانسية الحديقة' }, space: 'pines',
      words: ['garden', 'green', 'forest', 'pine', 'nature', 'romantic', 'flowers', 'rose', 'حديقة', 'أخضر', 'غابة', 'صنوبر', 'طبيعة', 'رومانسي', 'ورد'],
      palette: [['#F4F1E6', { en: 'Linen', ar: 'كتّاني' }], ['#B9C9A5', { en: 'Sage', ar: 'مريمية' }], ['#5E7F67', { en: 'Fern', ar: 'سرخسي' }], ['#E7B7B0', { en: 'Blush', ar: 'وردي خجول' }], ['#2E5A44', { en: 'Needle', ar: 'إبرة الصنوبر' }]],
      imgs: ['day-forest-path', 'day-palm', 'v-flower-cart'],
      names: { en: ['Between the Pines', 'A Wedding in the Forest', 'Fern and Blush'], ar: ['بين أشجار الصنوبر', 'عرس في الغابة', 'سرخس ووردي'] },
      decor: { en: ['Long wooden tables with greenery runners', 'Garden roses and baby’s breath in clay jugs', 'Edison bulbs strung between the trunks', 'A floral arch at the head of the aisle'], ar: ['طاولات خشبية طويلة بممرّات خضراء', 'ورد جوري وزهر النفس في أباريق فخّار', 'لمبات أديسون بين الجذوع', 'قوس ورد في بداية الممرّ'] },
    },
    {
      id: 'boho', name: { en: 'Canopy colors', ar: 'ألوان الخيم' }, space: 'canopies',
      words: ['boho', 'color', 'colour', 'colorful', 'henna', 'canopy', 'tent', 'fun', 'bright', 'ملوّن', 'ملون', 'ألوان', 'حنّاء', 'حنة', 'خيمة', 'خيم', 'بوهو'],
      palette: [['#D6364B', { en: 'Pomegranate', ar: 'رمّاني' }], ['#F0A020', { en: 'Saffron', ar: 'زعفراني' }], ['#1F9A92', { en: 'Teal', ar: 'فيروزي' }], ['#E8C4D6', { en: 'Rose water', ar: 'ماء الورد' }], ['#FBF3E2', { en: 'Candle', ar: 'شمعي' }]],
      imgs: ['day-canopies', 'day-pink-canopy', 'day-red-canopy'],
      names: { en: ['A Hundred Colors', 'The Canopy Henna', 'Saffron and Pomegranate'], ar: ['مية لون', 'حنّاء تحت الخيم', 'زعفران ورمّان'] },
      decor: { en: ['Layered fabric canopies in pomegranate and saffron', 'Low majlis seating with embroidered cushions', 'Brass lanterns and marigold garlands', 'Henna corner with a painted tray station'], ar: ['خيم قماش بطبقات رمّانية وزعفرانية', 'جلسات عربية منخفضة بمخدّات مطرّزة', 'فوانيس نحاس وأكاليل قطيفة', 'ركن حنّاء بصواني مرسومة'] },
    },
    {
      id: 'moonlit', name: { en: 'City lights', ar: 'أضواء المدينة' }, space: 'lookout',
      words: ['view', 'city', 'lights', 'night', 'moon', 'stars', 'sunset', 'proposal', 'minimal', 'modern', 'إطلالة', 'المدينة', 'أضواء', 'ليل', 'قمر', 'نجوم', 'غروب', 'طلب', 'مودرن'],
      palette: [['#0E1B2C', { en: 'Midnight', ar: 'منتصف الليل' }], ['#3B4D6B', { en: 'Dusk', ar: 'شفق' }], ['#D8DCE6', { en: 'Moon', ar: 'قمري' }], ['#F0A020', { en: 'City glow', ar: 'وهج المدينة' }], ['#FBF3E2', { en: 'Candle', ar: 'شمعي' }]],
      imgs: ['night-aframe-view', 'v-fringe-view', 'night-pergola-view'],
      names: { en: ['Above the City Lights', 'Moon over Amman', 'The Lookout Night'], ar: ['فوق أضواء المدينة', 'قمر فوق عمّان', 'ليلة الإطلالة'] },
      decor: { en: ['Glass votives along the deck edge', 'Crystal fringe chandeliers against the skyline', 'Midnight-blue linens with silver cutlery', 'A lounge of low sofas facing the view'], ar: ['شموع زجاجية على حافة الجلسة', 'ثريّات كريستال مقابل أفق المدينة', 'مفارش كحلية وأدوات فضية', 'جلسة كنب منخفضة باتجاه الإطلالة'] },
    },
    {
      id: 'rustic', name: { en: 'Rustic pine', ar: 'صنوبر ريفي' }, space: 'pines',
      words: ['rustic', 'wood', 'wooden', 'cozy', 'warm', 'cabin', 'autumn', 'winter', 'fire', 'ريفي', 'خشب', 'دافئ', 'كوخ', 'خريف', 'شتاء', 'نار'],
      palette: [['#6B4A2E', { en: 'Walnut', ar: 'جوزي' }], ['#B07A3C', { en: 'Amber', ar: 'كهرماني' }], ['#E9D8B8', { en: 'Oat', ar: 'شوفاني' }], ['#3C5A3E', { en: 'Pine', ar: 'صنوبري' }], ['#A4452E', { en: 'Ember', ar: 'جمر' }]],
      imgs: ['night-cabins-row', 'day-forest-souk', 'night-aframe'],
      names: { en: ['Cones and Candlelight', 'The Pine Lodge Evening', 'Ember and Walnut'], ar: ['أكواز وضوء شموع', 'سهرة كوخ الصنوبر', 'جمر وجوز'] },
      decor: { en: ['Pine cones and dried orange on the tables', 'Wood-slice centerpieces with pillar candles', 'Wool throws on the benches', 'A fire pit for the late hours'], ar: ['أكواز صنوبر وبرتقال مجفّف على الطاولات', 'قطع خشب بشموع عمودية', 'شالات صوف على المقاعد', 'موقد نار لآخر السهرة'] },
    },
  ];

  const buffets = {
    en: ['Mezze station with fresh bread from the saj', 'Live grill: kebab, shish tawook, lamb chops', 'Mansaf and lamb ouzi carving', 'Kunafa made in front of the guests', 'Fruit table and Arabic coffee'],
    ar: ['محطّة مقبّلات مع خبز صاج طازج', 'مشاوي حيّة: كباب وشيش طاووق وريش', 'منسف وقوزي لحم', 'كنافة تُحضَّر أمام الضيوف', 'سفرة فواكه وقهوة عربية'],
  };

  return { spaces, dishes, also, occasions, packages, addons, seats, moods, buffets, img };
})();
