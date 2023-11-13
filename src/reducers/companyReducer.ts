import { ICompany } from "@/domains/company";

type State = {
  companies: Array<ICompany>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_COMPANY"; payload: Array<ICompany> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function companyReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_COMPANY":
      try {
        return {
          companies: action.payload,
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
