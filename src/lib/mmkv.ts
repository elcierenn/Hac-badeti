import { createMMKV, type MMKV } from 'react-native-mmkv';

/**
 * Tüm uygulama tercihleri (dil, vb.) bu örnek üzerinden.
 * İkinci bir alan isterseniz: createMMKV({ id: '...' }) ile yeni örnek açın.
 */
export const appStorage: MMKV = createMMKV({ id: 'hac-ibadeti' });
