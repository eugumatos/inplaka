import { IProduct } from "@/domains/product";

type State = {
  products: Array<IProduct>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_PRODUCTS"; payload: Array<IProduct> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function productReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_PRODUCTS":
      try {
        return {
          products: action.payload,
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
