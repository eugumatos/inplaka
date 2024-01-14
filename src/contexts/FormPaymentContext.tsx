import { ReactNode, createContext, useReducer, useContext } from "react";
import { IFormPayment } from "@/domains/form-payment";
import { FormPaymentFormData } from "@/schemas/FormPaymentSchemaValidation";
import { formPaymentReducer } from "@/reducers/formPaymentReducer";
import {
  getFormPayments,
  createFormPayment,
  updateFormPayment,
  destroyFormPayment,
} from "@/services/form-payment";
import { toast } from "react-toastify";

interface FormPaymentContextProps {
  children?: ReactNode;
  formPayments?: Array<IFormPayment>;
}

interface FormPaymentProviderProps {
  isLoading: boolean;
  isError: boolean;
  formPayments: Array<IFormPayment>;
  addFormPayment: (formPayment: FormPaymentFormData) => void;
  editFormPayment: (formPayment: FormPaymentFormData) => void;
  removeFormPayment: (formPayment: IFormPayment) => void;
}

const FormPaymentContext = createContext<FormPaymentProviderProps>(
  {} as FormPaymentProviderProps
);

function FormPaymentProvider({
  formPayments = [],
  children,
}: FormPaymentContextProps) {
  const [state, dispatch] = useReducer(formPaymentReducer, {
    formPayments,
    isLoading: false,
    isError: false,
  });

  async function addFormPayment(formPayment: FormPaymentFormData) {
    try {
      dispatch({ type: "LOADING" });

      await createFormPayment(formPayment);

      const newFormPayments = await getFormPayments();

      dispatch({ type: "RELOAD_FORM_PAYMENT", payload: newFormPayments });

      toast.success("Forma de pagamento criada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar forma de pagamento");
    }
  }

  async function editFormPayment(formPayment: FormPaymentFormData) {
    try {
      dispatch({ type: "LOADING" });

      await updateFormPayment(formPayment);
      const newFormPayments = await getFormPayments();

      dispatch({ type: "RELOAD_FORM_PAYMENT", payload: newFormPayments });

      toast.success("Forma de pagamento editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar forma de pagamento");
    }
  }

  async function removeFormPayment(formPayment: IFormPayment) {
    try {
      dispatch({ type: "LOADING" });

      const findIdFormPayment = state.formPayments.find(
        (f) => f.descricao === formPayment.descricao
      );

      if (!findIdFormPayment) {
        throw new Error("ID Form Payment not found!");
      }

      await destroyFormPayment(findIdFormPayment.id);

      const formPayments = await getFormPayments();

      dispatch({ type: "RELOAD_FORM_PAYMENT", payload: formPayments });

      toast.success("Forma de pagamento removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover forma de pagamento");
    }
  }

  return (
    <FormPaymentContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        formPayments: state.formPayments,
        addFormPayment,
        editFormPayment,
        removeFormPayment,
      }}
    >
      {children}
    </FormPaymentContext.Provider>
  );
}

function useFormPayment() {
  const context = useContext(FormPaymentContext);

  return context;
}

export { FormPaymentProvider, useFormPayment };
