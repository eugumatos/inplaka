import { IUser } from "@/domains/user";

type State = {
  users: Array<IUser>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_USERS"; payload: Array<IUser> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_USERS":
      try {
        return {
          users: action.payload,
          isLoading: false,
          isError: false,
        };
      } catch (error) {
        return { ...state, isLoading: false, isError: true };
      }
    case "LOADING": {
      return { ...state, isLoading: true, isError: false };
    }
    case "ERROR": {
      return { ...state, isLoading: false, isError: true };
    }
    default:
      return { ...state };
  }
}
