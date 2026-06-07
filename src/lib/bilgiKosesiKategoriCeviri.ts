/**
 * Kategori isimleri renk eşlemesi için Türkçe anahtar olarak kalır;
 * burada sadece görüntülenen etiketin EN/AR çevirisi tutulur.
 */
export const BILGI_KOSESI_KATEGORI_CEVIRI: Record<string, { en: string; ar: string }> = {
  'Haccın Önemi': { en: 'The Importance of Hajj', ar: 'أهمية الحج' },
  'Kutsal Mekanlar': { en: 'Holy Places', ar: 'الأماكن المقدسة' },
  'Peygamberimizden': { en: 'From Our Prophet', ar: 'من سيرة نبينا' },
  'Hz. İbrahim': { en: 'Prophet Ibrahim', ar: 'النبي إبراهيم عليه السلام' },
  'İhram': { en: 'Ihram', ar: 'الإحرام' },
  'Tavaf': { en: 'Tawaf', ar: 'الطواف' },
  'Arafat Vakfesi': { en: 'Standing at Arafat', ar: 'الوقوف بعرفة' },
  "Sa'y": { en: "Sa'i", ar: 'السعي' },
  'Şeytan Taşlama': { en: 'Stoning the Devil', ar: 'رمي الجمرات' },
  'Kurban': { en: 'Sacrifice', ar: 'الأضحية' },
  'Pratik Bilgiler': { en: 'Practical Information', ar: 'معلومات عملية' },
  'Mekke Tarihi': { en: 'History of Makkah', ar: 'تاريخ مكة المكرمة' },
  'Medine': { en: 'Madinah', ar: 'المدينة المنورة' },
  'İlginç Bilgiler': { en: 'Interesting Facts', ar: 'معلومات مثيرة للاهتمام' },
  'Dualar': { en: 'Supplications', ar: 'الأدعية' },
  'Maneviyat': { en: 'Spirituality', ar: 'الروحانية' },
  'Önemli Kavramlar': { en: 'Key Concepts', ar: 'مفاهيم مهمة' },
};

export function kategoriEtiketCevir(kategori: string, lang: string): string {
  if (lang === 'en') return BILGI_KOSESI_KATEGORI_CEVIRI[kategori]?.en ?? kategori;
  if (lang === 'ar') return BILGI_KOSESI_KATEGORI_CEVIRI[kategori]?.ar ?? kategori;
  return kategori;
}
