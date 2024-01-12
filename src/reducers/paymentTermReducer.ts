import { IPaymentTerms } from "@/domains/payment-term";

type State = {
  paymentTerms: Array<IPaymentTerms>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_PAYMENT_TERMS"; payload: Array<IPaymentTerms> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function paymentTermReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_PAYMENT_TERMS":
      try {
        return {
          paymentTerms: action.payload,
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
