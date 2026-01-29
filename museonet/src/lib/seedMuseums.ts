const baseMuseumNames = [
  'Ақтөбе облыстық тарихи-өлкетану музейі',
  'Ботай музей-қорығы',
  'Шым қала тарихи-мәдени кешені',
  'Көкшетау тарих музейі',
  'Сарайшык музей-қорығы',
  'Кастеев өнер музейі',
  'Ұлттық музей',
  'Әзірет Сұлтан музей-қорығы',
  'Таңбалы музей-қорығы',
  'Берел музей-қорығы',
  'Отырар музей-қорығы',
  'Есік музей-қорығы',
  'Жаркент мешіті музейі',
  'Атырау облыстық өнер музейі',
  'Павлодар облыстық өлкетану музейі',
];

const regions = [
  'Ақтөбе облысы',
  'Атырау облысы',
  'Алматы',
  'Астана',
  'Шымкент',
  'Түркістан облысы',
  'Ақмола облысы',
  'Жетісу облысы',
  'СҚО',
  'Қарағанды облысы',
  'Павлодар облысы',
  'ШҚО',
];

const cities = [
  'Ақтөбе',
  'Атырау',
  'Алматы',
  'Астана',
  'Шымкент',
  'Түркістан',
  'Көкшетау',
  'Талдықорған',
  'Петропавл',
  'Қарағанды',
  'Павлодар',
  'Өскемен',
];

const categories = ['Үй-музей', 'Археология', 'Өнер', 'Қорық-музей', 'Өлкетану', 'Тарих'];

export type MuseumRecord = {
  id: number;
  name: string;
  location: string;
  city: string;
  region: string;
  category: string;
  description: string;
  address: string;
  hours: string;
  badge: string;
  price: string;
  kids: boolean;
  rating: number;
  hue: number;
  phone: string;
  website: string;
  image: string;
  gisLink: string;
};

export const seedMuseums = (count = 285): MuseumRecord[] =>
  Array.from({ length: count }, (_, index) => {
    const nameBase = baseMuseumNames[index % baseMuseumNames.length];
    const region = regions[index % regions.length];
    const city = cities[index % cities.length];
    const category = categories[index % categories.length];
    const rating = 4 + (index % 10) / 10;
    const price = index % 3 === 0 ? 'Тегін' : 'Ақылы';
    const hue = 18 + (index % 8) * 12;

    return {
      id: index + 1,
      name: `${nameBase} №${index + 1}`,
      location: `${city}, Қазақстан`,
      city,
      region,
      category,
      description: 'Қордағы негізгі жәдігерлер, экспозициялар және виртуалды тур материалдары.',
      address: `Негізгі көше, ${index + 5}`,
      hours: '09:00–18:00',
      badge: rating > 4.6 ? 'Ұсынылады' : `⭐ ${rating.toFixed(1)}`,
      price,
      kids: index % 2 === 0,
      rating,
      hue,
      phone: `+7 (7${index % 9}2) 00-00-${String(index % 100).padStart(2, '0')}`,
      website: 'https://museonet.kz',
      image: '',
      gisLink: `https://2gis.kz/search/${encodeURIComponent(`${nameBase} ${city}`)}`,
    };
  });
