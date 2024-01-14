import { ReactNode, createContext, useReducer, useContext } from "react";
import { SellerFormData } from "@/schemas/SellerSchemaValidation";
import { ISeller } from "@/domains/seller";
import { sellerReducer } from "@/reducers/sellerReducer";
import {
  createSeller,
  destroySeller,
  getSellers,
  updateSeller,
} from "@/services/seller";
import { toast } from "react-toastify";

interface SellerContextProps {
  children?: ReactNode;
  sellers?: Array<ISeller>;
}

interface SellerProviderProps {
  isLoading: boolean;
  isError: boolean;
  sellers: Array<ISeller>;
  addSeller: (seller: SellerFormData) => void;
  editSeller: (seller: SellerFormData) => void;
  removeSeller: (seller: ISeller) => void;
}

const SellerContext = createContext<SellerProviderProps>(
  {} as SellerProviderProps
);

function SellerProvider({ sellers = [], children }: SellerContextProps) {
  const [state, dispatch] = useReducer(sellerReducer, {
    sellers,
    isLoading: false,
    isError: false,
  });

  async function addSeller(seller: SellerFormData) {
    try {
      dispatch({ type: "LOADING" });
      await createSeller(seller);

      const newSellers = await getSellers();

      dispatch({ type: "RELOAD_SELLER", payload: newSellers });

      toast.success("Vendedor criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar vendedor");
    }
  }

  async function editSeller(seller: SellerFormData) {
    try {
      dispatch({ type: "LOADING" });

      await updateSeller(seller);
      const newSellers = await getSellers();

      dispatch({ type: "RELOAD_SELLER", payload: newSellers });

      toast.success("Vendedor editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar vendedor");
    }
  }

  async function removeSeller(seller: ISeller) {
    try {
      dispatch({ type: "LOADING" });

      const findSellerId = state.sellers.find((s) => s.nome === seller.nome);

      if (!findSellerId) {
        throw new Error("Seller ID not found!");
      }

      await destroySeller(findSellerId.id);

      const sellers = await getSellers();

      dispatch({ type: "RELOAD_SELLER", payload: sellers });

      toast.success("Vendedor removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover vendedor");
    }
  }

  return (
    <SellerContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        sellers: state.sellers,
        addSeller,
        removeSeller,
        editSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

function useSellers() {
  const context = useContext(SellerContext);

  return context;
}

export { SellerProvider, useSellers };
