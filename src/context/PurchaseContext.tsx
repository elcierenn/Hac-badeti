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
import { finishTransaction, useIAP, type Product, type Purchase } from 'react-native-iap';

import { AD_REMOVAL_PRODUCT_ID } from '../iap/products';

const STORAGE_KEY = '@hac_ibadeti_ad_free';

type Ctx = {
  isAdFree: boolean;
  adRemovalProduct: Product | null;
  purchasing: boolean;
  purchaseAdRemoval: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
};

const PurchaseContext = createContext<Ctx | null>(null);

function ownsAdRemoval(purchases: Purchase[]): boolean {
  return purchases.some((p) => p.productId === AD_REMOVAL_PRODUCT_ID);
}

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [isAdFree, setIsAdFree] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

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
    onPurchaseError: () => {
      setPurchasing(false);
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
    try {
      await requestPurchase({
        request: {
          apple: { sku: AD_REMOVAL_PRODUCT_ID },
          google: { skus: [AD_REMOVAL_PRODUCT_ID] },
        },
        type: 'in-app',
      });
    } catch {
      setPurchasing(false);
    }
  }, [requestPurchase]);

  const restorePurchases = useCallback(async () => {
    try {
      await getAvailablePurchases();
      return true;
    } catch {
      return false;
    }
  }, [getAvailablePurchases]);

  const adRemovalProduct = useMemo(
    () => products.find((p) => p.id === AD_REMOVAL_PRODUCT_ID) ?? null,
    [products],
  );

  const value = useMemo(
    () => ({ isAdFree, adRemovalProduct, purchasing, purchaseAdRemoval, restorePurchases }),
    [isAdFree, adRemovalProduct, purchasing, purchaseAdRemoval, restorePurchases],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchase() {
  const v = useContext(PurchaseContext);
  if (!v) throw new Error('usePurchase must be used within PurchaseProvider');
  return v;
}
