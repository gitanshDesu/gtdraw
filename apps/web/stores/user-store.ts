import { LoginUserType } from "@gtdraw/common/loginUser";
import { RegisterUserType } from "@gtdraw/common/registerUser";
import { createStore } from "zustand/vanilla";

export type UserState = {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  avatar?: string;
};

export type UserActions = {
  registerUser: (data: RegisterUserType) => void;
  loginUser: (data: LoginUserType) => void;
};

export const initUserStore = (): UserState => {
  return {
    username: "",
    fullName: "",
    email: "",
    password: "",
  };
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  username: "",
  fullName: "",
  password: "",
  email: "",
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    registerUser: (data) =>
      set(() => ({
        ...data,
      })),
    loginUser: ({ username, password, email }) =>
      set((state) => ({
        ...state,
        username,
        password,
        email,
      })),
  }));
};
