import type { AppLanguage } from '../i18n/config';

type KategoriCeviri = Partial<Record<Exclude<AppLanguage, 'tr'>, string>>;

/**
 * Kategori isimleri renk eşlemesi için Türkçe anahtar olarak kalır;
 * burada sadece görüntülenen etiketin çevirisi tutulur.
 */
export const BILGI_KOSESI_KATEGORI_CEVIRI: Record<string, KategoriCeviri> = {
  'Haccın Önemi': {
    en: 'The Importance of Hajj', ar: 'أهمية الحج', ur: 'حج کی اہمیت',
    id: 'Pentingnya Haji', bn: 'হজের গুরুত্ব', fr: "L'importance du Hajj", fa: 'اهمیت حج',
  },
  'Kutsal Mekanlar': {
    en: 'Holy Places', ar: 'الأماكن المقدسة', ur: 'مقدس مقامات',
    id: 'Tempat-Tempat Suci', bn: 'পবিত্র স্থানসমূহ', fr: 'Lieux saints', fa: 'اماکن مقدس',
  },
  'Peygamberimizden': {
    en: 'From Our Prophet', ar: 'من سيرة نبينا', ur: 'ہمارے نبی ﷺ سے',
    id: 'Dari Nabi Kita', bn: 'আমাদের নবী থেকে', fr: 'De notre Prophète', fa: 'از پیامبر ما',
  },
  'Hz. İbrahim': {
    en: 'Prophet Ibrahim', ar: 'النبي إبراهيم عليه السلام', ur: 'حضرت ابراہیم علیہ السلام',
    id: 'Nabi Ibrahim', bn: 'হযরত ইব্রাহিম (আঃ)', fr: 'Le prophète Abraham', fa: 'حضرت ابراهیم',
  },
  'İhram': {
    en: 'Ihram', ar: 'الإحرام', ur: 'احرام',
    id: 'Ihram', bn: 'ইহরাম', fr: 'Ihram', fa: 'احرام',
  },
  'Tavaf': {
    en: 'Tawaf', ar: 'الطواف', ur: 'طواف',
    id: 'Tawaf', bn: 'তাওয়াফ', fr: 'Tawaf', fa: 'طواف',
  },
  'Arafat Vakfesi': {
    en: 'Standing at Arafat', ar: 'الوقوف بعرفة', ur: 'وقوفِ عرفہ',
    id: 'Wukuf di Arafah', bn: 'আরাফাতের অবস্থান', fr: "Station à Arafat", fa: 'وقوف عرفات',
  },
  "Sa'y": {
    en: "Sa'i", ar: 'السعي', ur: 'سعی',
    id: "Sa'i", bn: 'সাঈ', fr: 'Sa’i', fa: 'سعی',
  },
  'Şeytan Taşlama': {
    en: 'Stoning the Devil', ar: 'رمي الجمرات', ur: 'رمی جمرات',
    id: 'Melempar Jumrah', bn: 'শয়তানকে পাথর নিক্ষেপ', fr: 'Lapidation de Satan', fa: 'رمی جمرات',
  },
  'Kurban': {
    en: 'Sacrifice', ar: 'الأضحية', ur: 'قربانی',
    id: 'Kurban', bn: 'কুরবানি', fr: 'Sacrifice', fa: 'قربانی',
  },
  'Pratik Bilgiler': {
    en: 'Practical Information', ar: 'معلومات عملية', ur: 'عملی معلومات',
    id: 'Informasi Praktis', bn: 'ব্যবহারিক তথ্য', fr: 'Informations pratiques', fa: 'اطلاعات کاربردی',
  },
  'Mekke Tarihi': {
    en: 'History of Makkah', ar: 'تاريخ مكة المكرمة', ur: 'مکہ کی تاریخ',
    id: 'Sejarah Makkah', bn: 'মক্কার ইতিহাস', fr: 'Histoire de La Mecque', fa: 'تاریخ مکه',
  },
  'Medine': {
    en: 'Madinah', ar: 'المدينة المنورة', ur: 'مدینہ منورہ',
    id: 'Madinah', bn: 'মদিনা', fr: 'Médine', fa: 'مدینه',
  },
  'İlginç Bilgiler': {
    en: 'Interesting Facts', ar: 'معلومات مثيرة للاهتمام', ur: 'دلچسپ معلومات',
    id: 'Fakta Menarik', bn: 'আকর্ষণীয় তথ্য', fr: 'Faits intéressants', fa: 'نکات جالب',
  },
  'Dualar': {
    en: 'Supplications', ar: 'الأدعية', ur: 'دعائیں',
    id: 'Doa-Doa', bn: 'দোয়াসমূহ', fr: 'Invocations', fa: 'دعاها',
  },
  'Maneviyat': {
    en: 'Spirituality', ar: 'الروحانية', ur: 'روحانیت',
    id: 'Spiritualitas', bn: 'আধ্যাত্মিকতা', fr: 'Spiritualité', fa: 'معنویت',
  },
  'Önemli Kavramlar': {
    en: 'Key Concepts', ar: 'مفاهيم مهمة', ur: 'اہم اصطلاحات',
    id: 'Konsep Penting', bn: 'গুরুত্বপূর্ণ ধারণা', fr: 'Concepts clés', fa: 'مفاهیم مهم',
  },
};

export function kategoriEtiketCevir(kategori: string, lang: AppLanguage): string {
  if (lang === 'tr') return kategori;
  return BILGI_KOSESI_KATEGORI_CEVIRI[kategori]?.[lang] ?? kategori;
}
