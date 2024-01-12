import { IAccount } from "@/domains/account";

type State = {
  accounts: Array<IAccount>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_ACCOUNT"; payload: Array<IAccount> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function accountReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_ACCOUNT":
      try {
        return {
          accounts: action.payload,
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
