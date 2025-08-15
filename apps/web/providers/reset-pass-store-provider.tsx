"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type ResetPassStore,
  createResetPassStore,
  initResetPassStore,
} from "@/stores/reset-pass-store";

export type ResetPassStoreApi = ReturnType<typeof createResetPassStore>;

export const ResetPassStoreContext = createContext<
  ResetPassStoreApi | undefined
>(undefined);

export interface ResetPassStoreProviderProps {
  children: ReactNode;
}

export const ResetPassStoreProvider = ({
  children,
}: ResetPassStoreProviderProps) => {
  const storeRef = useRef<ResetPassStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createResetPassStore(initResetPassStore());
  }
  return (
    <ResetPassStoreContext.Provider value={storeRef.current}>
      {children}
    </ResetPassStoreContext.Provider>
  );
};

export const useResetPassStore = <T,>(
  selector: (store: ResetPassStore) => T
): T => {
  const resetPassStoreContext = useContext(ResetPassStoreContext);
  if (!resetPassStoreContext) {
    throw new Error(`useResetPassStore must be used within UserStoreProvider`);
  }
  return useStore(resetPassStoreContext, selector);
};
