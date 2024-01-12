import { ISeller } from "@/domains/seller";

type State = {
  sellers: Array<ISeller>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_SELLER"; payload: Array<ISeller> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function sellerReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_SELLER":
      try {
        return {
          sellers: action.payload,
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
