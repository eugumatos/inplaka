import { IBill } from "@/domains/bill";

type State = {
  bills: Array<IBill>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_BILL"; payload: Array<IBill> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function billReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_BILL":
      try {
        return {
          bills: action.payload,
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
