import { ISupplier } from "@/domains/supplier";

type State = {
  suppliers: Array<ISupplier>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_SUPPLIER"; payload: Array<ISupplier> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function supplierReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_SUPPLIER":
      try {
        return {
          suppliers: action.payload,
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
