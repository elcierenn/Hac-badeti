import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  finishTransaction,
  getAvailablePurchases as queryAvailablePurchases,
  isUserCancelledError,
  useIAP,
  type Product,
  type Purchase,
} from 'react-native-iap';

import { AD_REMOVAL_PRODUCT_ID } from '../iap/products';

const STORAGE_KEY = '@hac_ibadeti_ad_free';

export type RestoreResult = 'restored' | 'not_found' | 'error';

type Ctx = {
  isAdFree: boolean;
  adRemovalProduct: Product | null;
  purchasing: boolean;
  purchaseError: string | null;
  clearPurchaseError: () => void;
  purchaseAdRemoval: () => Promise<void>;
  restorePurchases: () => Promise<RestoreResult>;
};

const PurchaseContext = createContext<Ctx | null>(null);

function ownsAdRemoval(purchases: Purchase[]): boolean {
  return purchases.some((p) => p.productId === AD_REMOVAL_PRODUCT_ID);
}

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [isAdFree, setIsAdFree] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const clearPurchaseError = useCallback(() => setPurchaseError(null), []);

  const persistAdFree = useCallback((value: boolean) => {
    setIsAdFree(value);
    AsyncStorage.setItem(STORAGE_KEY, value ? '1' : '0').catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw === '1') setIsAdFree(true);
      })
      .catch(() => {});
  }, []);

  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    getAvailablePurchases,
    availablePurchases,
  } = useIAP({
    onPurchaseSuccess: (purchase) => {
      if (purchase.productId === AD_REMOVAL_PRODUCT_ID) {
        persistAdFree(true);
        finishTransaction({ purchase, isConsumable: false }).catch(() => {});
      }
      setPurchasing(false);
    },
    onPurchaseError: (error) => {
      setPurchasing(false);
      if (!isUserCancelledError(error)) {
        setPurchaseError(error.message || 'purchase_failed');
      }
    },
  });

  useEffect(() => {
    if (connected) {
      fetchProducts({ skus: [AD_REMOVAL_PRODUCT_ID], type: 'in-app' }).catch(() => {});
    }
  }, [connected, fetchProducts]);

  useEffect(() => {
    if (ownsAdRemoval(availablePurchases)) {
      persistAdFree(true);
    }
  }, [availablePurchases, persistAdFree]);

  const purchaseAdRemoval = useCallback(async () => {
    setPurchasing(true);
    setPurchaseError(null);
    try {
      await requestPurchase({
        request: {
          apple: { sku: AD_REMOVAL_PRODUCT_ID },
          google: { skus: [AD_REMOVAL_PRODUCT_ID] },
        },
        type: 'in-app',
      });
    } catch (error) {
      setPurchasing(false);
      if (!isUserCancelledError(error)) {
        setPurchaseError(error instanceof Error ? error.message : 'purchase_failed');
      }
    }
  }, [requestPurchase]);

  const restorePurchases = useCallback(async (): Promise<RestoreResult> => {
    try {
      const purchases = await queryAvailablePurchases();
      // Keep the useIAP hook's own state (availablePurchases) in sync too.
      getAvailablePurchases().catch(() => {});
      if (ownsAdRemoval(purchases)) {
        persistAdFree(true);
        return 'restored';
      }
      return 'not_found';
    } catch {
      return 'error';
    }
  }, [getAvailablePurchases, persistAdFree]);

  const adRemovalProduct = useMemo(
    () => products.find((p) => p.id === AD_REMOVAL_PRODUCT_ID) ?? null,
    [products],
  );

  const value = useMemo(
    () => ({
      isAdFree,
      adRemovalProduct,
      purchasing,
      purchaseError,
      clearPurchaseError,
      purchaseAdRemoval,
      restorePurchases,
    }),
    [
      isAdFree,
      adRemovalProduct,
      purchasing,
      purchaseError,
      clearPurchaseError,
      purchaseAdRemoval,
      restorePurchases,
    ],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchase() {
  const v = useContext(PurchaseContext);
  if (!v) throw new Error('usePurchase must be used within PurchaseProvider');
  return v;
}
