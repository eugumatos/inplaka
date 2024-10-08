import { ReactNode, createContext, useReducer, useContext } from "react";
import { OpenBillFormData } from "@/schemas/OpenBillSchemaValidation";
import { IOpenBill } from "@/domains/open-bill";
import { openBillReducer } from "@/reducers/openBill/reducer";
import {
  loadingOpenBillAction,
  errorOpenBillAction,
  editOpenBillAction,
} from "@/reducers/openBill/action";
import { toast } from "react-toastify";
import { updateOpenBillInstalment } from "@/services/biils";
import { getFormPayments } from "@/services/form-payment";

interface SelectProps {
  label: string;
  value: string;
}

interface OpenBillContextProps {
  children?: ReactNode;
  openBills?: Array<IOpenBill>;
}

interface OpenBillProviderProps {
  isLoading: boolean;
  isError: boolean;
  openBills: Array<IOpenBill>;
  paymentFormOptions: (value: string) => Promise<SelectProps[]>;
  editOpenBill: (openBill: OpenBillFormData) => void;
}

const OpenBillContext = createContext<OpenBillProviderProps>(
  {} as OpenBillProviderProps
);

function OpenBillProvider({ openBills = [], children }: OpenBillContextProps) {
  const [openBillState, dispatch] = useReducer(openBillReducer, {
    openBills,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  async function paymentFormOptions(value: string) {
    try {
      const sellers = await getFormPayments();
      const options = sellers
        .map((seller) => ({
          value: seller.id,
          label: seller.descricao,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar formas de pagamento.");

      return [];
    }
  }

  async function editOpenBill(openBill: OpenBillFormData) {
    try {
      const formattedValue = {
        id: openBill?.id,
        id_Conta: openBill?.id_Conta,
        nro_Parcela: Number(openBill?.nro_Parcela),
        data_Pagamento: new Date(openBill?.data_pagamento),
        valor_Pago: openBill?.valor_Pago,
        documento: openBill?.documento,
        data_Vencimento: openBill?.data_Vencimento,
        forma_pagamento: openBill?.forma_pagamento?.value,
        status: openBill?.status,
        valor_Parcela: openBill?.valor_Parcela,
      } as any;

      dispatch(loadingOpenBillAction());

      await updateOpenBillInstalment(formattedValue);

      dispatch(editOpenBillAction(formattedValue));

      toast.success("Parcela editada com sucesso!");

    } catch (error) {
      dispatch(errorOpenBillAction());
      toast.error("Erro ao editar parcela");
    }
  }

  return (
    <OpenBillContext.Provider
      value={{
        isError: openBillState.isError,
        isLoading: openBillState.isLoading,
        openBills: openBillState.openBills,
        editOpenBill,
        paymentFormOptions
      }}
    >
      {children}
    </OpenBillContext.Provider>
  );
}

function useOpenBills() {
  const context = useContext(OpenBillContext);

  return context;
}

export { OpenBillProvider, useOpenBills };
