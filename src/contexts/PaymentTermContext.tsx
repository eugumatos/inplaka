import { ReactNode, createContext, useReducer, useContext } from "react";
import { IPaymentTerms } from "@/domains/payment-term";
import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { paymentTermReducer } from "@/reducers/paymentTermReducer";
import {
  getPaymentTerms,
  createPaymentTerm,
  updatePaymentTerm,
  destroyPaymentTerm,
} from "@/services/payment-term";
import { toast } from "react-toastify";

interface PaymentTermContextProps {
  children?: ReactNode;
  paymentTerms?: Array<IPaymentTerms>;
}

interface PaymentTermProviderProps {
  isLoading: boolean;
  isError: boolean;
  paymentTerms: Array<IPaymentTerms>;
  addPaymentTerm: (paymentTerm: PaymentTermFormData) => void;
  editPaymentTerm: (paymentTerm: PaymentTermFormData) => void;
  removePaymentTerm: (paymentTerm: IPaymentTerms) => void;
}

const PaymentTermContext = createContext<PaymentTermProviderProps>(
  {} as PaymentTermProviderProps
);

function PaymentTermProvider({
  paymentTerms = [],
  children,
}: PaymentTermContextProps) {
  const [state, dispatch] = useReducer(paymentTermReducer, {
    paymentTerms,
    isLoading: false,
    isError: false,
  });

  async function addPaymentTerm(paymentTerm: PaymentTermFormData) {
    try {
      dispatch({ type: "LOADING" });

      await createPaymentTerm(paymentTerm);

      const newPaymentTerms = await getPaymentTerms();

      dispatch({ type: "RELOAD_PAYMENT_TERMS", payload: newPaymentTerms });

      toast.success("Condiçãoo de pagamento criada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar condição de pagamento");
    }
  }

  async function editPaymentTerm(paymentTerm: PaymentTermFormData) {
    try {
      dispatch({ type: "LOADING" });

      const findPaymentTermId = state.paymentTerms.find(
        (p) => p.descricao === paymentTerm.descricao
      );

      if (!findPaymentTermId) {
        throw new Error("Payment Term ID not found!");
      }

      await updatePaymentTerm(findPaymentTermId.id, paymentTerm);
      const newPaymentTerms = await getPaymentTerms();

      dispatch({ type: "RELOAD_PAYMENT_TERMS", payload: newPaymentTerms });

      toast.success("Condição de pagamento editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar condição de pagamento");
    }
  }

  async function removePaymentTerm(paymentTerm: IPaymentTerms) {
    try {
      dispatch({ type: "LOADING" });

      const findPaymentTermId = state.paymentTerms.find(
        (p) => p.descricao === paymentTerm.descricao
      );

      if (!findPaymentTermId) {
        throw new Error("Payment Term ID not found!");
      }

      await destroyPaymentTerm(findPaymentTermId.id);

      const paymentTerms = await getPaymentTerms();

      dispatch({ type: "RELOAD_PAYMENT_TERMS", payload: paymentTerms });

      toast.success("Condição de pagamento removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover condição de pagamento");
    }
  }

  return (
    <PaymentTermContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        paymentTerms: state.paymentTerms,
        addPaymentTerm,
        editPaymentTerm,
        removePaymentTerm,
      }}
    >
      {children}
    </PaymentTermContext.Provider>
  );
}

function usePaymentTerms() {
  const context = useContext(PaymentTermContext);

  return context;
}

export { PaymentTermProvider, usePaymentTerms };
