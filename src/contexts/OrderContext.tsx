import { IOrder } from "@/domains/order";
import { orderReducer } from "@/reducers/orderReducer";
import { ReactNode, createContext, useContext, useReducer } from "react";
import {
  createOrder,
  getOrders,
  updateOrder,
  destroyOrder,
} from "@/services/order";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { toast } from "react-toastify";

interface OrderContextProps {
  children?: ReactNode;
  orders?: Array<IOrder>;
}

interface OrderProviderProps {
  isLoading: boolean;
  isError: boolean;
  orders: Array<IOrder>;
  addOrder: (order: OrderFormData) => void;
  editOrder: (order: OrderFormData) => void;
  removeOrder: (id: string) => void;
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

  async function addOrder(order: OrderFormData) {
    console.log(order);

    /*
    try {
      dispatch({ type: "LOADING" });

      await createOrder(order);

      const newOrders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: newOrders });

      toast.success("Pedido criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar pedido.");
    }
    */
  }

  async function editOrder(order: OrderFormData) {
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
        addOrder,
        editOrder,
        removeOrder,
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
