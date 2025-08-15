import { createStore } from "zustand/vanilla";

export type ResetPassState = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ResetPassActionData = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ResetPassActions = {
  setResetPass: (data: ResetPassActionData) => void;
};

export const initResetPassStore = (): ResetPassState => {
  return {
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
};

export type ResetPassStore = ResetPassState & ResetPassActions;

export const defaultInitState: ResetPassState = {
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const createResetPassStore = (
  initState: ResetPassState = defaultInitState
) => {
  return createStore<ResetPassStore>()((set) => ({
    ...initState,
    setResetPass: (data) =>
      set((state) => ({
        ...state,
        ...data, // merge w/o overwriting everything (although set handles this but still written for better clarity)
      })),
  }));
};
