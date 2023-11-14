import { IOrder } from "@/domains/order";

type State = {
  orders: Array<IOrder>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_COMPANY"; payload: Array<IOrder> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function orderReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_COMPANY":
      try {
        return {
          orders: action.payload,
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
