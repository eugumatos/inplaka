import { ReactNode, createContext, useReducer, useContext } from "react";
import { ISupplier } from "@/domains/supplier";
import { supplierReducer } from "@/reducers/supplierReducer";
import {
  createSupplier,
  destroySupplier,
  updateSupplier,
  getSuppliers,
} from "@/services/supplier";
import { SupplierFormData } from "@/schemas/SupplierSchemaValidation";
import { toast } from "react-toastify";

interface SupplierContextProps {
  children?: ReactNode;
  suppliers?: Array<ISupplier>;
}

interface SupplierProviderProps {
  isLoading: boolean;
  isError: boolean;
  suppliers: Array<ISupplier>;
  addSupplier: (supplier: SupplierFormData) => void;
  editSupplier: (supplier: SupplierFormData) => void;
  removeSupplier: (supplier: ISupplier) => void;
}

const SupplierContext = createContext<SupplierProviderProps>(
  {} as SupplierProviderProps
);

function SupplierProvider({ suppliers = [], children }: SupplierContextProps) {
  const [state, dispatch] = useReducer(supplierReducer, {
    suppliers,
    isLoading: false,
    isError: false,
  });

  async function addSupplier(supplier: SupplierFormData) {
    try {
      dispatch({ type: "LOADING" });
      await createSupplier(supplier);

      const newSuppliers = await getSuppliers();

      dispatch({ type: "RELOAD_SUPPLIER", payload: newSuppliers });

      toast.success("Fornecedor criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar fornecedor");
    }
  }

  async function editSupplier(supplier: SupplierFormData) {
    try {
      dispatch({ type: "LOADING" });

      const findSupplierId = state.suppliers.find(
        (s) => s.apelido === supplier.apelido
      );

      if (!findSupplierId) {
        throw new Error("Supplier ID not found!");
      }

      await updateSupplier(findSupplierId.id, supplier);
      const newSuppliers = await getSuppliers();

      dispatch({ type: "RELOAD_SUPPLIER", payload: newSuppliers });

      toast.success("Fornecedor editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar fornecedor");
    }
  }

  async function removeSupplier(supplier: ISupplier) {
    try {
      dispatch({ type: "LOADING" });

      const findSupplierId = state.suppliers.find(
        (s) => s.apelido === supplier.apelido
      );

      if (!findSupplierId) {
        throw new Error("Supplier ID not found!");
      }

      await destroySupplier(findSupplierId.id);

      const suppliers = await getSuppliers();

      dispatch({ type: "RELOAD_SUPPLIER", payload: suppliers });

      toast.success("Fornecedor removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover fornecedor");
    }
  }

  return (
    <SupplierContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        suppliers: state.suppliers,
        addSupplier,
        removeSupplier,
        editSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

function useSuppliers() {
  const context = useContext(SupplierContext);

  return context;
}

export { SupplierProvider, useSuppliers };
