import { ReactNode, createContext, useReducer, useContext } from "react";
import { ProductFormData } from "@/schemas/ProductSchemaValidation";
import { IProduct } from "@/domains/product";
import { productReducer } from "@/reducers/productReducer";
import {
  createProduct,
  destroyProduct,
  getProducts,
  updateProduct,
} from "@/services/product";
import { toast } from "react-toastify";

interface ProductContextProps {
  children?: ReactNode;
  products?: Array<IProduct>;
}

interface ProductProviderProps {
  isLoading: boolean;
  isError: boolean;
  products: Array<IProduct>;
  addProduct: (product: ProductFormData) => void;
  editProduct: (product: ProductFormData) => void;
  removeProduct: (product: IProduct) => void;
}

const ProductContext = createContext<ProductProviderProps>(
  {} as ProductProviderProps
);

function ProductProvider({ products = [], children }: ProductContextProps) {
  const [state, dispatch] = useReducer(productReducer, {
    products,
    isLoading: false,
    isError: false,
  });

  async function addProduct(product: ProductFormData) {
    try {
      dispatch({ type: "LOADING" });
      await createProduct(product);

      const newProducts = await getProducts();

      dispatch({ type: "RELOAD_PRODUCTS", payload: newProducts });

      toast.success("Produto criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar produto");
    }
  }

  async function editProduct(product: ProductFormData) {
    try {
      dispatch({ type: "LOADING" });

      const findProductId = state.products.find(
        (p) => p.descricao === product.descricao
      );

      if (!findProductId) {
        throw new Error("Product ID not found!");
      }

      await updateProduct(findProductId.id, product);
      const newProducts = await getProducts();

      dispatch({ type: "RELOAD_PRODUCTS", payload: newProducts });

      toast.success("Produto editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar produto");
    }
  }

  async function removeProduct(product: IProduct) {
    try {
      dispatch({ type: "LOADING" });

      const findProductId = state.products.find(
        (p) => p.descricao === product.descricao
      );

      if (!findProductId) {
        throw new Error("Product ID not found!");
      }

      await destroyProduct(findProductId.id);

      const products = await getProducts();

      dispatch({ type: "RELOAD_PRODUCTS", payload: products });

      toast.success("Produto removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover produto");
    }
  }

  return (
    <ProductContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        products: state.products,
        addProduct,
        removeProduct,
        editProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

function useProducts() {
  const context = useContext(ProductContext);

  return context;
}

export { ProductProvider, useProducts };
