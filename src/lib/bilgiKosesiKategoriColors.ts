/**
 * Aynı kategori her zaman aynı başlık rengi (tatlı, ayırt edilebilir tonlar).
 */
export const BILGI_KOSES_KATEGORI_BASLIK_RENK: Record<string, string> = {
  'Haccın Önemi': '#C25B7A',
  'Kutsal Mekanlar': '#0D9488',
  'Peygamberimizden': '#D4A01E',
  'Hz. İbrahim': '#A8642A',
  'İhram': '#5A7FC4',
  'Tavaf': '#7C3A2D',
  'Arafat Vakfesi': '#1F7A4A',
  "Sa'y": '#2563EB',
  'Şeytan Taşlama': '#A21E4E',
  'Kurban': '#B91C1C',
  'Pratik Bilgiler': '#0E7490',
  'Mekke Tarihi': '#6D28D9',
  'Medine': '#15803D',
  'İlginç Bilgiler': '#C2410C',
  'Dualar': '#4338CA',
  'Maneviyat': '#7C3AED',
  'Önemli Kavramlar': '#A16207',
};

function hashHue(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = s.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 55%, 38%)`;
}

export function kategoriBaslikRengi(kategori: string): string {
  return BILGI_KOSES_KATEGORI_BASLIK_RENK[kategori] ?? hashHue(kategori);
}
