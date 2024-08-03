import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useFormContext } from "react-hook-form";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { IPlaque } from "../OrderTabs/OrderPlaques";

import { getProductByClient } from "@/services/product";
import { IProduct } from "@/domains/product";
import { toast } from "react-toastify";

interface ProductsContextData {
  products: IProduct[];
  isLoading: boolean;
  updateProductAmount: (product: IProduct, amount: number) => void;
}

const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData
);

interface ProductsProviderProps {
  children: ReactNode;
  defaultProducts?: IProduct[];
}

export const OrderProductProvider: React.FC<ProductsProviderProps> = ({
  children,
  defaultProducts = [],
}) => {
  const { watch } = useFormContext<OrderFormData>();

  const [products, setProducts] = useState<IProduct[]>(defaultProducts);
  const [isLoading, setLoading] = useState(false);

  const clientId = watch("cliente")?.value || "";

  async function loadingProducts() {
    try {
      setLoading(true);
      const response = await getProductByClient(clientId);

      const formattedProducts = response.map((product) => {
        return {
          ...product,
          quantidade: 0,
          placa: "",
          placas: [],
          valorUnitario: product.valor_venda_cliente,
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      toast.error("Erro ao carregar produtos.");

      throw new Error("Error to load products by client.");
    } finally {
      setLoading(false);
    }
  }

  const updateProductAmount = useCallback((product: IProduct, amount: number) {
    setProducts((state) =>
      state.map((item) => {
        if (product.id === item.id) {
          return {
            ...item,
            quantidade: amount,
          };
        }
        return item;
      })
    );
  }, [products])

  const updateProductPlaque = useCallback(
    (id: string, plaques: IPlaque[]) => {
      const findProduct = products.find((p) => p.id === id);

      if (
        findProduct &&
        findProduct.quantidade > 0 &&
        findProduct.placas &&
        findProduct.placas.length <= findProduct.quantidade
      ) {
        setProducts((state) =>
          state.map((item) => {
            if (findProduct.id === item.id && item.placas) {
              return {
                ...findProduct,
                placas: plaques,
              };
            } else {
              return item;
            }
          })
        );

        setPlaques(plaques);
      }
    },
    [products]
  );

  useEffect(() => {
    if (clientId !== "") loadingProducts();
  }, [clientId]);

  return (
    <ProductsContext.Provider
      value={{ products, isLoading, updateProductAmount }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useOrderProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a OrderProductProvider");
  }
  return context;
};
