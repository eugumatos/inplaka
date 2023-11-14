import { IFormPayment } from "@/domains/form-payment";

type State = {
  formPayments: Array<IFormPayment>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_FORM_PAYMENT"; payload: Array<IFormPayment> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function formPaymentReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_FORM_PAYMENT":
      try {
        return {
          formPayments: action.payload,
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
