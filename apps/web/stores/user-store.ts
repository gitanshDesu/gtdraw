import { createStore } from "zustand/vanilla";

export type UserState = {
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export type RegisterUserActionData = {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
};

export type LoginUserActionData = {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
};

export type UserActions = {
  setRegisterUser: (data: RegisterUserActionData) => void;
  setLoginUser: (data: LoginUserActionData & { avatar: string }) => void;
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
    setRegisterUser: (data) =>
      set(() => ({
        ...data,
      })),
    setLoginUser: (data) =>
      set(() => ({
        ...data,
      })),
  }));
};
