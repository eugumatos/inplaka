import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { getClients } from "@/services/clients";
import { getSellers } from "@/services/seller";
import { getFormPayments } from "@/services/form-payment";
import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";
import { getProducts } from "@/services/product";
import { getServices } from "@/services/service";

interface SelectProps {
  label: string;
  value: string;
}

interface FormValues {
  [key: string]: {
    quantidade?: string;
    valorUnitario?: number;
  };
}

interface UseOrderFormProps {
  products: IProduct[];
  services: IService[];
  loadServicesAndProducts: () => void;
  clientOptions: (value: string) => Promise<SelectProps[]>;
  sellerOptions: (value: string) => Promise<SelectProps[]>;
  paymentOptions: (value: string) => Promise<SelectProps[]>;
  updateProductAmount: (product: IProduct, amount: number) => void;
  updateServiceAmount: (product: IService, amount: number) => void;
  updateProductPlaque: (id: string, name: string) => void;
  removeProductPlaque: (id: string, name: string) => void;
  calculateTotal: () => {
    total: number;
    subTotalProducts: number;
    subTotalServices: number;
  };
}

export function useOrderForm(): UseOrderFormProps {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);

  const loadServicesAndProducts = useCallback(async () => {
    try {
      const products: IProduct[] = await getProducts();
      const services: IService[] = await getServices();

      const formattedProducts = products.map((product) => {
        return {
          ...product,
          quantidade: 0,
          placas: [],
        };
      });

      const formattedServices = services.map((service) => {
        return {
          ...service,
          quantidade: 0,
        };
      });

      setProducts(formattedProducts);
      setServices(formattedServices);
    } catch (error) {
      throw new Error("Erro ao listar produtos e serviços");
    }
  }, []);

  async function clientOptions(value: string) {
    try {
      const clients = await getClients();
      const options = clients
        .map((client) => ({
          value: client.id,
          label: client.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar clientes");

      return [];
    }
  }

  async function sellerOptions(value: string) {
    try {
      const sellers = await getSellers();
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
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  async function paymentOptions(value: string) {
    try {
      const formPayments = await getFormPayments();
      const options = formPayments
        .map((formPayment) => ({
          value: formPayment.id,
          label: formPayment.descricao,
        }))
        .filter((item: { label: string }) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  const updateProductAmount = useCallback(
    (product: IProduct, amount: number) => {
      const findProduct = products.find((p) => p.id === product.id);

      if (findProduct) {
        setProducts((state) =>
          state.map((item) => {
            if (product.id === item.id) {
              return {
                ...findProduct,
                quantidade: amount,
              };
            } else {
              return item;
            }
          })
        );
      }
    },
    [products]
  );

  const updateServiceAmount = useCallback(
    (service: IService, amount: number) => {
      const findService = services.find((s) => s.id === service.id);

      if (findService) {
        setServices((state) =>
          state.map((item) => {
            if (service.id === item.id) {
              return {
                ...findService,
                quantidade: amount,
              };
            } else {
              return item;
            }
          })
        );
      }
    },
    [services]
  );

  const updateProductPlaque = useCallback(
    (id: string, name: string) => {
      const findProduct = products.find((p) => p.id === id);

      if (
        findProduct &&
        findProduct.quantidade > 0 &&
        findProduct.placas.length <= findProduct.quantidade
      ) {
        setProducts((state) =>
          state.map((item) => {
            if (findProduct.id === item.id) {
              return {
                ...findProduct,
                placas: [...findProduct.placas, name],
              };
            } else {
              return item;
            }
          })
        );
      }
    },
    [products]
  );

  const removeProductPlaque = useCallback(
    (id: string, name: string) => {
      const findProduct = products.find((p) => p.id === id);

      if (findProduct) {
        setProducts((state) =>
          state.map((item) => {
            if (findProduct.id === item.id) {
              return {
                ...findProduct,
                placas: findProduct.placas.filter((p) => p !== name),
              };
            } else {
              return item;
            }
          })
        );
      }
    },
    [products]
  );

  function calculateTotal() {
    const selectedProducts = products.filter(
      (product) => product.quantidade > 0
    );
    const selectedServices = services.filter(
      (service) => service.quantidade > 0
    );

    const totalProducts = selectedProducts.reduce((acc, cartItem) => {
      return acc + cartItem.quantidade * Number(cartItem.valor_venda);
    }, 0);

    const totalServices = selectedServices.reduce((acc, cartItem) => {
      return acc + cartItem.quantidade * Number(cartItem.valor_venda);
    }, 0);

    return {
      total: totalProducts + totalServices,
      subTotalProducts: totalProducts,
      subTotalServices: totalServices,
    };
  }

  return {
    products,
    services,
    loadServicesAndProducts,
    clientOptions,
    sellerOptions,
    paymentOptions,
    updateProductAmount,
    updateServiceAmount,
    updateProductPlaque,
    removeProductPlaque,
    calculateTotal,
  };
}
