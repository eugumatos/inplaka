import { ReactNode, createContext, useReducer, useContext } from "react";
import { stockReducer } from "@/reducers/stockReducer";
import { IStock } from "@/domains/stock";
import { getStock, updateStock } from "@/services/stock";
import { toast } from "react-toastify";
import { StockFormData } from "@/schemas/StockSchemaValidation";

interface StockContextProps {
  children?: ReactNode;
  stock?: Array<IStock>;
}

interface StockProviderProps {
  isLoading: boolean;
  isError: boolean;
  stock: Array<IStock>;
  editStock: (stock: StockFormData) => void;
}

const StockContext = createContext<StockProviderProps>(
  {} as StockProviderProps
);

function StockProvider({ stock = [], children }: StockContextProps) {
  const [state, dispatch] = useReducer(stockReducer, {
    stock,
    isLoading: false,
    isError: false,
  });

  async function editStock(stock: StockFormData) {
    try {
      dispatch({ type: "LOADING" });

      stock = {
        descricao: "ACERTO MANUAL",
        produto: stock.produto,
        quantidade: stock.quantidade,
        codigoMovimento: stock.codigoMovimento,
      };

      await updateStock(stock);
      const stockList = await getStock();

      dispatch({ type: "RELOAD_STOCK", payload: stockList });

      toast.success("Estoque editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar estoque");
    }
  }

  return (
    <StockContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        stock: state.stock,
        editStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

function useStock() {
  const context = useContext(StockContext);

  return context;
}

export { StockProvider, useStock };
