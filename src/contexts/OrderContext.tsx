import { IOrder } from "@/domains/order";
import { orderReducer } from "@/reducers/orderReducer";
import { ReactNode, createContext, useContext, useReducer } from "react";

interface OrderContextProps {
  children?: ReactNode;
  orders?: Array<IOrder>;
}

interface OrderProviderProps {
  isLoading: boolean;
  isError: boolean;
  orders: Array<IOrder>;
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

  return (
    <OrderContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        orders: state.orders,
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
