import { IOrder } from "@/domains/order";
import { orderReducer } from "@/reducers/orderReducer";
import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  destroyOrder,
  validateExistingPlaques,
} from "@/services/order";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { generateCode } from "@/utils/generateCode";
import { toast } from "react-toastify";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";

interface OrderContextProps {
  children?: ReactNode;
  orders?: Array<IOrder>;
}

interface OrderProviderProps {
  isLoading: boolean;
  isError: boolean;
  orders: Array<IOrder>;
  order: any;
  finishingModalShouldBeOpen: boolean;
  closeFinishingModal: () => void;
  searchOrder: (id: string) => Promise<IOrder | undefined>;
  addOrder: (order: OrderFormData, close?: () => void) => void;
  editOrder: (order: OrderFormData, close?: () => void) => void;
  removeOrder: (id: string) => void;
}

interface FillPlaqueProps {
  amount: number;
  plaques: Array<string>;
}

function fillPlaques({ amount, plaques }: FillPlaqueProps) {
  let plaqueList: Array<string> = [];

  Array.from(Array(amount).keys()).map((t, k) => {
    plaques.map((p, key) => {
      if (key == t) {
        plaqueList.push(p);
      }
    });

    if (!!plaqueList[k]) {
      return;
    }

    plaqueList.push(`INPLK-${generateCode()}`);
  });

  return plaqueList;
}

const OrderContext = createContext<OrderProviderProps>(
  {} as OrderProviderProps
);

function OrderProvider({ orders = [], children }: OrderContextProps) {
  const [state, dispatch] = useReducer(orderReducer, {
    orders,
    isLoading: false,
    isError: false,
  });

  const { loadCurrentOrder } = useOrderForm();

  const [finishingModalShouldBeOpen, setFinishingModalShouldBeOpen] =
    useState(false);

  const [order, setOrder] = useState({});

  async function closeFinishingModal() {
    setFinishingModalShouldBeOpen(false);
  }

  async function addOrder(order: OrderFormData, close?: () => void) {
    try {
      dispatch({ type: "LOADING" });

      Object.assign(order, {
        valorPedido: order.total,
        valorDesconto: order.desconto,
        valorTotal: order.total,
        status: "ABERTO",
        produtos: order.produtos.map((product) => {
          return {
            produto: product.id,
            descricao: product.descricao,
            placas: fillPlaques({
              amount: product.quantidade,
              plaques: product.placas,
            }),
            placa:
              product.placas.length > 0
                ? fillPlaques({
                    amount: product.quantidade,
                    plaques: product.placas,
                  })
                    .map((p) => p)
                    .join(",")
                : Array.from(Array(product.quantidade).keys())
                    .map((p) => `INPLK-${generateCode()}`)
                    .join(","),
            quantidade: product.quantidade,
            valorUnitario: product.valor_venda,
          };
        }),
        servicos: order.servicos.map((s) => {
          return {
            servico: s.id,
            descricao: s.descricao,
            quantidade: s.quantidade,
            valorUnitario: s.valor_venda,
          };
        }),
      });

      const plaqueList = order.produtos
        .map((product) => product.placa)
        .join(",");

      const plaques = await validateExistingPlaques(plaqueList);

      if (plaques.length > 0) {
        toast.warning(
          "Há algumas placas que já foram cadastradas no sistemas anteriormente, por favor verifique e tente novamente."
        );

        return;
      }

      await createOrder(order);

      setOrder(order);
      close && close();

      const newOrders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: newOrders });

      toast.success("Pedido criado com sucesso!");
      setFinishingModalShouldBeOpen(true);
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar pedido.");
      close && close();
    }
  }

  async function editOrder(order: OrderFormData, close?: () => void) {
    console.log("update:", order.cliente);
    /*
    try {
      const findIdOrder = state.orders.find((o) => o.id === order.id);

      if (!findIdOrder) {
        throw new Error("ID Order not found!");
      }

      await updateOrder(findIdOrder.id, order);
      const updatedOrders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: updatedOrders });

      toast.success("Forma de pagamento editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar pedido.");
    }
    */
  }

  async function searchOrder(id: string): Promise<IOrder | undefined> {
    try {
      const order = await getOrder(id);
      loadCurrentOrder(order);

      return order;
    } catch (error) {
      toast.error("Erro ao carregar pedido.");
    }
  }

  async function removeOrder(id: string) {
    try {
      dispatch({ type: "LOADING" });

      await destroyOrder(id);

      const orders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: orders });

      toast.success("Pedido removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover pedido.");
    }
  }

  return (
    <OrderContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        orders: state.orders,
        order: order,
        addOrder,
        editOrder,
        searchOrder,
        removeOrder,
        finishingModalShouldBeOpen,
        closeFinishingModal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

function useOrder() {
  const context = useContext(OrderContext);

  return context;
}

export { OrderProvider, useOrder };
