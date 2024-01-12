import { IService } from "@/domains/service";

type State = {
  services: Array<IService>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_SERVICE"; payload: Array<IService> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function serviceReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_SERVICE":
      try {
        return {
          services: action.payload,
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
