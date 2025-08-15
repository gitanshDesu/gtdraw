import { createStore } from "zustand/vanilla";

export type UserState = {
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export type setUserActionData = {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
};

export type UserActions = {
  setUser: (data: Partial<setUserActionData>) => void;
};

export const initUserStore = (): UserState => {
  return {
    username: "",
    fullName: "",
    email: "",
    avatar: "",
  };
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  username: "",
  fullName: "",
  email: "",
  avatar: "",
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  //using currying
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUser: (data) =>
      set((state) => ({
        ...state,
        ...data, // merge w/o overwriting everything
      })),
    resetUser: () => set(defaultInitState), //reset user to default values i.e. "" after log out.
  }));
};
