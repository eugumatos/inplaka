import {
  ReactNode,
  createContext,
  useReducer,
  useContext,
  useCallback,
} from "react";
import { BillFormData } from "@/schemas/BillSchemaValidation";
import { IBill } from "@/domains/bill";
import { billReducer } from "@/reducers/billReducer";
import {
  createBill,
  destroyBill,
  getBills,
  updateBill,
} from "@/services/biils";
import { getFormPayments } from "@/services/form-payment";
import { getSuppliers } from "@/services/supplier";
import { ISupplier } from "@/domains/supplier";
import { IFormPayment } from "@/domains/form-payment";
import { toast } from "react-toastify";
import currency from "currency.js";
import { unmaskText } from "@/utils/unmaskText";
import { format } from "date-fns";

interface SelectProps {
  label: string;
  value: string;
}

interface BillContextProps {
  children?: ReactNode;
  bills?: Array<IBill>;
}

interface BillProviderProps {
  isLoading: boolean;
  isError: boolean;
  bills: Array<IBill>;
  supplierOptions: (value: string) => Promise<SelectProps[]>;
  paymentFormOptions: (value: string) => Promise<SelectProps[]>;
  addBill: (bill: BillFormData) => void;
  editBill: (bill: BillFormData) => void;
  removeBill: (bill: IBill) => void;
}

const BillContext = createContext<BillProviderProps>({} as BillProviderProps);

function BillProvider({ bills = [], children }: BillContextProps) {
  const [state, dispatch] = useReducer(billReducer, {
    bills,
    isLoading: false,
    isError: false,
  });

  async function supplierOptions(value: string) {
    try {
      const sellers = await getSuppliers();
      const options = sellers
        .map((seller) => ({
          value: seller.id,
          label: seller.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar fornecedores.");

      return [];
    }
  }

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

  async function addBill(bill: BillFormData) {
    try {
      Object.assign(bill, {
        data_vencimento: format(
          new Date(bill.data_vencimento) as any,
          "yyyy-MM-dd"
        ),
        data_pagamento: format(
          new Date(bill.data_pagamento) as any,
          "yyyy-MM-dd"
        ),
        data_emissao: format(new Date(bill.data_emissao) as any, "yyyy-MM-dd"),
        forma_pagamento: bill.forma_pagamento.value,
        fornecedor: bill.fornecedor.value,
        valor: unmaskText(bill.valor),
      });

      dispatch({ type: "LOADING" });
      await createBill(bill);

      const newBills = await getBills();

      dispatch({ type: "RELOAD_BILL", payload: newBills });

      toast.success("Conta a pagar criada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar conta a pagar");
    }
  }

  async function editBill(bill: BillFormData) {
    try {
      Object.assign(bill, {
        data_vencimento: format(
          new Date(bill.data_vencimento) as any,
          "yyyy-MM-dd"
        ),
        data_pagamento: format(
          new Date(bill.data_pagamento) as any,
          "yyyy-MM-dd"
        ),
        data_emissao: format(new Date(bill.data_emissao) as any, "yyyy-MM-dd"),
        forma_pagamento: bill.forma_pagamento.value,
        fornecedor: bill.fornecedor.value,
        valor: unmaskText(bill.valor),
      });

      dispatch({ type: "LOADING" });

      await updateBill(bill);
      const newBills = await getBills();

      dispatch({ type: "RELOAD_BILL", payload: newBills });

      toast.success("Conta a pagar editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar conta a pagar");
    }
  }

  async function removeBill(bill: IBill) {
    try {
      dispatch({ type: "LOADING" });

      const findBillId = state.bills.find(
        (b) => b.descrição === bill.descrição
      );

      if (!findBillId) {
        throw new Error("Bill ID not found!");
      }

      await destroyBill(findBillId.id);

      const bills = await getBills();

      dispatch({ type: "RELOAD_BILL", payload: bills });

      toast.success("Conta a pagar removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover conta a pagar");
    }
  }

  return (
    <BillContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        bills: state.bills,
        addBill,
        removeBill,
        editBill,
        supplierOptions,
        paymentFormOptions,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

function useBills() {
  const context = useContext(BillContext);

  return context;
}

export { BillProvider, useBills };
