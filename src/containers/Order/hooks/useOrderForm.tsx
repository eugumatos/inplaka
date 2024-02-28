import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { getClients } from "@/services/clients";
import { getSellers } from "@/services/seller";
import { getFormPayments } from "@/services/form-payment";
import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";
import { getProducts } from "@/services/product";
import { getServices } from "@/services/service";
import { getOrder, getPlaques } from "@/services/order";
import { IClient } from "@/domains/client";
import { upper } from "@/utils/upper";
import { ISeller } from "@/domains/seller";
import { IFormPayment } from "@/domains/form-payment";

interface SelectProps {
  label: string;
  value: string;
}

interface IUseOrderFormProps {
  id?: string;
  noFetch?: boolean;
  shouldPreLoad?: boolean;
}

interface IPlaques {
  name: string;
}

interface UseOrderFormProps {
  isLoading: boolean;
  products: IProduct[];
  services: IService[];
  clients: IClient[];
  registeredPlaques: IPlaques[];
  formatImportData: (parsedData: any) => any;
  clientOptions: (value: string) => Promise<SelectProps[]>;
  sellerOptions: (value: string) => Promise<SelectProps[]>;
  paymentOptions: (value: string) => Promise<SelectProps[]>;
  seekSelectedClientOption: (id: string) => void;
  seekSelectedSellerOption: (id: string) => void;
  seekSelectedPaymentOption: (id: string) => void;
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

export function useOrderForm({
  id,
  shouldPreLoad = false,
  noFetch = false,
}: IUseOrderFormProps): UseOrderFormProps {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [formPayments, setFormPayments] = useState<IFormPayment[]>([]);
  const [allPlaques, setPlaques] = useState<IPlaques[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = useCallback(async (value: string) => {
    try {
      const clients = await getClients();

      setClients(clients);

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
  }, []);

  const sellerOptions = useCallback(async (value: string) => {
    try {
      const sellers = await getSellers();

      setSellers(sellers);

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
  }, []);

  const paymentOptions = useCallback(async (value: string) => {
    try {
      const formPayments = await getFormPayments();

      setFormPayments(formPayments);

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
  }, []);

  const seekSelectedClientOption = async (id: string) => {
    const findClient = (await clientOptions("")).find(
      (client) => client.value === id
    );

    if (findClient) {
      return findClient;
    }
  };

  const seekSelectedSellerOption = async (id: string) => {
    const findSeller = (await sellerOptions("")).find(
      (seller) => seller.value === id
    );

    if (findSeller) {
      return findSeller;
    }
  };

  const seekSelectedPaymentOption = async (id: string) => {
    const findPaymentOption = (await paymentOptions("")).find(
      (paymentOption) => paymentOption.value === id
    );

    if (findPaymentOption) {
      return findPaymentOption;
    }
  };

  const formatImportData = (parsedData: any) => {
    const findClient = clients.find(
      (c) => upper(c.apelido) === upper(parsedData.cliente)
    );

    const findSeller = sellers.find(
      (s) => upper(s.apelido) === upper(parsedData.vendedor)
    );

    const findFormPayment = formPayments.find(
      (p) => upper(p.descricao) === upper(parsedData.formaPagamento)
    );

    const findProduct = products.find(
      (p) => upper(p.descricao) === "PAR DE PLACAS MERCOSUL"
    );

    parsedData.produtos = parsedData?.produtos.map((item: any) => {
      return {
        ...item,
        produto: findProduct?.id,
        descricao: findProduct?.descricao,
        valorUnitario: findProduct?.valor_venda,
      };
    });

    const orderTotal = parsedData?.produtos.reduce((acc: any, curr: any) => {
      return acc + curr.quantidade * Number(curr.valorUnitario);
    }, 0);

    const formattedData = {
      cliente: findClient?.id,
      vendedor: findSeller?.id,
      formaPagamento: findFormPayment?.id,
      valorPedido: orderTotal,
      valorDesconto: parsedData.desconto,
      valorTotal: Number(orderTotal),
      produtos: parsedData?.produtos,
      status: "ABERTO",
      servicos: [],
    };

    return formattedData;
  };

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

  const calculateTotal = useCallback(() => {
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
  }, [products, services]);

  useEffect(() => {
    setIsLoading(true);

    async function preLoadServices() {
      const clientsData = await getClients();
      const sellersData = await getSellers();
      const formPaymentsData = await getFormPayments();
      const productsData = await getProducts();

      setClients(clientsData);
      setSellers(sellersData);
      setFormPayments(formPaymentsData);
      setProducts(productsData);
    }

    async function loadServiceAndProducts() {
      try {
        const products: IProduct[] = await getProducts();
        const services: IService[] = await getServices();

        const formattedProducts = products.map((product) => {
          return {
            ...product,
            quantidade: 0,
            placa: "",
            placas: [],
            valorUnitario: product.valor_venda,
          };
        });

        const formattedServices = services.map((service) => {
          return {
            ...service,
            valorUnitario: service.valor_venda,
            quantidade: 0,
          };
        });

        setProducts(formattedProducts);
        setServices(formattedServices);
      } catch (error) {
        throw new Error("Erro ao listar produtos e serviços");
      }
    }

    async function loadServiceAnOrdersById() {
      if (!id) return;

      try {
        const products: IProduct[] = await getProducts();
        const services: IService[] = await getServices();

        const response = await getOrder(id);

        const selectedProducts = products.map((item) => {
          const macthingItem = response.produtos?.find(
            (product) => product.produto === item.id
          );

          return macthingItem
            ? {
                ...item,
                descricao: macthingItem.descricao,
                placa: macthingItem.placa,
                quantidade: macthingItem.quantidade,
                placas:
                  macthingItem.quantidade > 1
                    ? macthingItem.placa?.split(",")
                    : [macthingItem.placa],
                valorUnitario: macthingItem.valorUnitario,
              }
            : {
                ...item,
                descricao: item.descricao,
                quantidade: 0,
                placa: "",
                placas: [],
                valorUnitario: item.valor_venda,
              };
        });

        const selectedServices = services.map((item) => {
          const macthingItem = response.servicos?.find(
            (service) => service.servico === item.id
          );

          return macthingItem
            ? {
                ...item,
                descricao: macthingItem.descricao,
                valorUnitario: macthingItem.valorUnitario,
                quantidade: macthingItem.quantidade,
              }
            : {
                ...item,
                valorUnitario: item.valor_venda,
                quantidade: 0,
              };
        });

        setProducts(selectedProducts);
        setServices(selectedServices);
      } catch (error) {
        throw new Error("Erro ao carregar pedido!");
      }
    }

    async function loadPlaqueList() {
      try {
        if (!id) return;

        const plaques = await getPlaques(id);

        const list: string[] = [];

        plaques.forEach((p) => {
          p.placa?.split(",").length > 1
            ? list.push(...p.placa?.split(","))
            : list.push(p.placa);
        });

        setPlaques(
          list.map((p) => {
            return {
              name: p,
            };
          })
        );
      } catch (error) {
        throw new Error("Erro ao carregar lista de placas!");
      }
    }

    if (shouldPreLoad) {
      preLoadServices();
    }

    if (!noFetch) {
      if (id) {
        loadServiceAnOrdersById();
        loadPlaqueList();
      } else {
        loadServiceAndProducts();
      }
    }

    setIsLoading(false);
  }, [id, noFetch, shouldPreLoad]);

  return {
    isLoading,
    products,
    services,
    clients,
    clientOptions,
    sellerOptions,
    paymentOptions,
    formatImportData,
    registeredPlaques: allPlaques,
    seekSelectedClientOption,
    seekSelectedSellerOption,
    seekSelectedPaymentOption,
    updateProductAmount,
    updateServiceAmount,
    updateProductPlaque,
    removeProductPlaque,
    calculateTotal,
  };
}
