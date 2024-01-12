import { IClient } from "@/domains/client";

type State = {
  clients: Array<IClient>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_CLIENT"; payload: Array<IClient> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function clientReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_CLIENT":
      try {
        return {
          clients: action.payload,
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
