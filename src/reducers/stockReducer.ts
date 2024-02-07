import { IStock } from "@/domains/stock";

type State = {
  stock: Array<IStock>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_STOCK"; payload: Array<IStock> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function stockReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_STOCK":
      try {
        return {
          stock: action.payload,
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
