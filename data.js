(function () {
  'use strict';
  const RAW = [
  [
    "Design Republic",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "8 700 303 5000",
    ""
  ],
  [
    "Brain Twister (BrainTwister.design)",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "+7 701 173 99 91 / +7 702 777 13 41",
    "brain_twister@mail.ru"
  ],
  [
    "Blackspace",
    "Almaty",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 707 429 77 99",
    "blackspacedsgn@gmail.com"
  ],
  [
    "Studio Mint Almaty (Студия дизайна Мята)",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "",
    "office@studio-mint.ru"
  ],
  [
    "Design-Interior.kz",
    "Almaty",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 771 851 77 77",
    ""
  ],
  [
    "Boiko Architects",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "+7 701 218 60 43",
    ""
  ],
  [
    "Renovatio Design",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "+7 778 476 72 66",
    "renovatio.design.kz@gmail.com"
  ],
  [
    "DiAmir Interiors",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "+7 701 772 81 87",
    ""
  ],
  [
    "QUB Architects",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "+7 707 070 50 77",
    ""
  ],
  [
    "Khalansky Architects",
    "Almaty",
    "Interiorismo",
    "No",
    "Alto",
    "",
    ""
  ],
  [
    "IDAL Concept",
    "Almaty",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "",
    ""
  ],
  [
    "Lux House (Almaty architecture bureau)",
    "Almaty",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 777 348 10 47",
    "luxhouse_s@mail.ru"
  ],
  [
    "Woodlife (bathroom interior design)",
    "Almaty",
    "Baño",
    "No",
    "Medio-Alto",
    "+7 700 5555 999",
    ""
  ],
  [
    "TS2S (Дизайн офиса, ресторана, квартиры, дома)",
    "Almaty",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 778 537 03 94",
    ""
  ],
  [
    "Interstone (Caesarstone / Grandex Quartz official dealer)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Alto",
    "",
    ""
  ],
  [
    "Glory Stone",
    "Almaty",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 707 840 10 00",
    ""
  ],
  [
    "Verona Stone",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 702 218 22 38",
    "masterstone@yandex.kz"
  ],
  [
    "QStone",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio",
    "+7 700 600 57 86",
    ""
  ],
  [
    "Luxury Stone (LuxuryStone.kz)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 777 010 45 45",
    ""
  ],
  [
    "Ark Stone Group (Mramor.kz)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "",
    ""
  ],
  [
    "Mir Mramora (World of Marble)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 776 175 25 55",
    ""
  ],
  [
    "Stonex Group",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 700 607 70 87",
    ""
  ],
  [
    "Stonehead Almaty",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "",
    ""
  ],
  [
    "Unique KZ (Unique-Co)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 702 218 19 15",
    ""
  ],
  [
    "Italon Experience Almaty",
    "Almaty",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 727 339 84 75",
    "sales@salonatmosfera.kz"
  ],
  [
    "Kerama Marazzi KZ",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 727 310 88 88 / +7 771 705 17 47",
    "info@keramacenter.com"
  ],
  [
    "Lady Plitka",
    "Almaty",
    "Híbrido",
    "Sí",
    "Medio",
    "+7 708 845 86 73 / +7 771 376 50 14",
    "info@ladyplitka.kz"
  ],
  [
    "Kitchen House",
    "Almaty",
    "Cocina",
    "Sí",
    "Medio",
    "+7 707 194 48 56",
    ""
  ],
  [
    "Sanni Kitchens",
    "Almaty",
    "Cocina",
    "Sí",
    "Medio",
    "+7 727 378 92 94 / +7 707 194 48 56",
    ""
  ],
  [
    "Maxxfine (MaxFine showroom - Valcucine / Inalco / FMG / Rimadesio)",
    "Almaty",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 776 444 77 03 / +7 771 768 99 49",
    "maxxfine.furniture@gmail.com"
  ],
  [
    "Solemio (Sole Mio Arredamenti - Antonio Lupi dealer)",
    "Almaty",
    "Baño",
    "Sí",
    "Alto",
    "",
    ""
  ],
  [
    "Deluxe House (DH-Studio)",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 700 300-03-40",
    ""
  ],
  [
    "White Cube",
    "Astana",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 707 665-27-28",
    ""
  ],
  [
    "Biar Studio",
    "Astana",
    "Interiorismo",
    "No",
    "Medio",
    "+7 778 000-08-34",
    "info@biar.kz"
  ],
  [
    "Antonovych Design",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 776 111-01-25",
    ""
  ],
  [
    "Clever Design",
    "Astana",
    "Interiorismo",
    "No",
    "Medio",
    "+7 702 094-70-22",
    ""
  ],
  [
    "Bayakov Architectural Studio (Arman Bayakov)",
    "Astana",
    "Interiorismo",
    "No",
    "Medio",
    "+7 705 290-06-06",
    ""
  ],
  [
    "Luxhouse (Lux-House Architectural Bureau)",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 777 348-10-47",
    "luxhouse_s@mail.ru"
  ],
  [
    "Aiziya Shayakhmet Interiors",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 702 311-88-80",
    ""
  ],
  [
    "Design Republic",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 700 303-5000",
    ""
  ],
  [
    "Kvadrat Architects",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 701 255-36-46",
    ""
  ],
  [
    "Design Store",
    "Astana",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 701 300-58-80",
    ""
  ],
  [
    "Mon.Arch",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 702 069-29-93",
    "info@mon-arch.kz"
  ],
  [
    "Aulet Architecture",
    "Astana",
    "Interiorismo",
    "No",
    "Alto",
    "+7 701 070-04-01",
    ""
  ],
  [
    "Artidea",
    "Astana",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 701 362-87-88",
    ""
  ],
  [
    "Astana Quartz",
    "Astana",
    "Híbrido",
    "Sí",
    "Medio",
    "+7 700 505-01-24",
    ""
  ],
  [
    "Interstone",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 707 840-10-00",
    ""
  ],
  [
    "Natural Stone Astana",
    "Astana",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 701 726-39-42",
    ""
  ],
  [
    "Tasplus",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "",
    ""
  ],
  [
    "MakStone",
    "Astana",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "",
    ""
  ],
  [
    "Big Tile",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 776 108-00-00",
    ""
  ],
  [
    "Italon Experience Astana",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 7017 575-201",
    "Dirkz@palazzo.pro"
  ],
  [
    "Costa Ceramica (Astana showroom)",
    "Astana",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 714 256-64-17",
    "info@costaceramica.kz"
  ],
  [
    "Ceramo Stone Group",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 701 643-74-19",
    ""
  ],
  [
    "Poliform Astana",
    "Astana",
    "Híbrido",
    "Sí",
    "Alto",
    "+7 776 465-88-33",
    "info@poliform.kz"
  ],
  [
    "Invogue (B&B Italia Astana)",
    "Astana",
    "Interiorismo",
    "Sí",
    "Alto",
    "",
    ""
  ],
  [
    "Akniet",
    "Astana",
    "Interiorismo",
    "Sí",
    "Alto",
    "+7 727 258-85-66",
    "marketing@akniet.kz"
  ],
  [
    "MK Mebel",
    "Astana",
    "Híbrido",
    "Sí",
    "Medio-Alto",
    "+7 778 344-12-21",
    ""
  ],
  [
    "Infatti",
    "Astana",
    "Baño",
    "Sí",
    "Alto",
    "+7 747 517-75-13",
    "info@infatti.ru"
  ],
  [
    "Neoceramica Astana",
    "Astana",
    "Baño",
    "Sí",
    "Medio",
    "+7 707 380-99-80",
    ""
  ],
  [
    "INTERSTONE (Shymkent branch)",
    "Shymkent",
    "Híbrido",
    "Sí",
    "Medio",
    "+7 707 840 10 00",
    "office@interstone.kz"
  ],
  [
    "IMPRESSIVE (Impressive Home)",
    "Shymkent",
    "Interiorismo",
    "No",
    "Alto",
    "",
    ""
  ],
  [
    "DiNatale",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "",
    ""
  ],
  [
    "Radiance Plus",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio",
    "+7 707 280 0063",
    "radianceplus@yandex.kz"
  ],
  [
    "Creative Home",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 778 323 3635",
    ""
  ],
  [
    "The Modern Design Studio (@designer_bereke)",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 777 966 9222",
    ""
  ],
  [
    "MARSA (design & architecture studio, @design_marsa)",
    "Shymkent",
    "Interiorismo",
    "No",
    "Alto",
    "",
    ""
  ],
  [
    "Gulvira group",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio-Alto",
    "+7 701 132 8391",
    ""
  ],
  [
    "Premium Home (@premium_space.kz)",
    "Shymkent",
    "Interiorismo",
    "Sí",
    "Alto",
    "+7 700 827 2222",
    ""
  ],
  [
    "Koleso Design (@koleso.design)",
    "Shymkent",
    "Interiorismo",
    "No",
    "Medio",
    "",
    ""
  ]
];
  const translate = {
    category: { 'Interiorismo': 'Interior design', 'Híbrido': 'Hybrid', 'Cocina': 'Kitchen', 'Baño': 'Bathroom' },
    showroom: { 'Sí': 'Yes', 'No': 'No' },
    price: { 'Alto': 'High', 'Medio-Alto': 'Medium-High', 'Medio': 'Medium' }
  };
  const method = Object.freeze({
    fit: Object.freeze({ Hybrid: 40, Kitchen: 34, Bathroom: 30, 'Interior design': 16 }),
    exposure: Object.freeze({ Yes: 30, No: 6 }),
    price: Object.freeze({ High: 30, 'Medium-High': 20, Medium: 10 })
  });
  const slug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const reasonFor = (row) => {
    const parts = [];
    if (row.showroom === 'Yes') parts.push('physical showroom access');
    if (row.category === 'Hybrid') parts.push('strong material and design fit');
    else if (row.category === 'Kitchen' || row.category === 'Bathroom') parts.push('category-specialist fit');
    else parts.push('specifier influence');
    parts.push(row.price === 'High' ? 'premium positioning' : row.price === 'Medium-High' ? 'upper-mid positioning' : 'accessible entry positioning');
    return parts.join(', ');
  };
  const intelligenceFor = (name, city, row) => {
    const folder = city.toLowerCase();
    const unknown = 'Not evidenced in current research';
    const known = [
      { match:/interstone/i, file:'interstone.md', website:'https://interstone.kz/', brands:'Caesarstone; Avant Quartz; GRANDEX Quartz; NOBLLE Quartz', evidence:'The captured Interstone catalogue identifies these engineered-surface brands.' },
      { match:/maxxfine/i, file:'maxxfine.md', brands:'Valcucine; Inalco; FMG; Rimadesio', evidence:'The captured account name and local research identify these represented brands.' },
      { match:/solemio|sole mio/i, file:'solemio.md', brands:'Antonio Lupi', evidence:'The captured account name and local research identify Sole Mio as an Antonio Lupi dealer.' },
      { match:/italon experience/i, file:city==='Astana'?'italon-astana.md':'italon-experience-almaty.md', brands:'Italon', evidence:'The account is an evidenced Italon Experience location.' },
      { match:/kerama marazzi/i, file:'kerama-marazzi-kz.md', brands:'Kerama Marazzi', evidence:'The account identity directly evidences the represented brand.' },
      { match:/poliform/i, file:'poliform-astana.md', brands:'Poliform', evidence:'The account identity and captured local research evidence the represented brand.' },
      { match:/invogue|b&b italia/i, file:'invogue-bb-italia.md', brands:'B&B Italia', evidence:'The captured account name and local research identify the B&B Italia relationship.' }
    ];
    const hit = known.find((item) => item.match.test(name));
    const action = row.showroom === 'Yes'
      ? `Validate decision-maker and propose a ${row.category === 'Hybrid' ? 'multi-material' : 'category-led'} showroom sample programme.`
      : 'Validate physical display capacity and specification influence before arranging a product presentation.';
    return {
      website: hit?.website || '',
      address: unknown,
      brands: hit?.brands || unknown,
      evidence: hit?.evidence || 'No competing or comparable brand relationship is evidenced in the current structured research.',
      source: hit ? `../research/${folder}/${hit.file}` : '',
      recommendedAction: action
    };
  };
  const prospects = RAW.map((source, index) => {
    const category = translate.category[source[2]];
    const showroom = translate.showroom[source[3]];
    const price = translate.price[source[4]];
    const score = method.fit[category] + method.exposure[showroom] + method.price[price];
    const row = {
      id: String(index + 1).padStart(2, '0') + '-' + slug(source[0]),
      name: source[0], city: source[1], category, showroom, price,
      phone: source[5] || '', email: source[6] || '',
      priority: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
      score,
      serviceBreadth: showroom === 'Yes' ? 'Design + supply / showroom' : 'Design / specification',
      reason: ''
    };
    row.reason = reasonFor(row);
    Object.assign(row, intelligenceFor(row.name, row.city, row));
    return Object.freeze(row);
  });
  window.KZ_PROSPECTS = Object.freeze(prospects);
  window.KZ_META = Object.freeze({
    cities: Object.freeze(['Almaty', 'Astana', 'Shymkent']),
    categories: Object.freeze(['Interior design', 'Hybrid', 'Kitchen', 'Bathroom']),
    priorities: Object.freeze(['High', 'Medium', 'Low']),
    prices: Object.freeze(['High', 'Medium-High', 'Medium']),
    method
  });
}());
