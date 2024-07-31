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
  destroyOrder,
  filterOrderByDate,
} from "@/services/order";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { generateCode } from "@/utils/generateCode";
import { formatDate } from "@/utils/formatDate";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { IProduct } from "@/domains/product";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

interface SetterOrderProps {
  cliente: string;
  dateCreated: string;
  produtos: IProduct[];
  numero: number;
  total: number;
}

interface OrderContextProps {
  children?: ReactNode;
  orders?: Array<IOrder>;
}

interface OrderProviderProps {
  isLoading: boolean;
  isError: boolean;
  orders: Array<IOrder>;
  order: any;
  currentOrderNumber: number | null;
  finishingModalShouldBeOpen: boolean;
  closeFinishingModal: () => void;
  setterOrder: (order: SetterOrderProps) => void;
  actionOrder: (order: OrderFormData, close?: () => void) => void;
  importOrder: (order: OrderFormData, close?: () => void) => void;
  editOrder: (order: OrderFormData, close?: () => void) => void;
  removeOrder: (id: string) => void;
  filterOrder: ({ startDate, endDate }: RangeDate) => void;
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
  const [currentOrderNumber, setCurrentOrderNumber] = useState<number | null>(
    null
  );

  const [state, dispatch] = useReducer(orderReducer, {
    orders,
    isLoading: false,
    isError: false,
  });

  const [finishingModalShouldBeOpen, setFinishingModalShouldBeOpen] =
    useState(false);

  const [order, setOrder] = useState({});

  async function closeFinishingModal() {
    setFinishingModalShouldBeOpen(false);
  }

  async function actionOrder(order: OrderFormData, close?: () => void) {
    try {
      dispatch({ type: "LOADING" });

      const findIdOrder = state.orders.find((o) => o.id === order.id);

      if (findIdOrder) {
        await removeOrder(findIdOrder.id, "notShowMessage");

        delete order?.id;
        delete order?.dateCreated;
        delete order?.formaPagamentoNome;
        delete order?.clienteNome;
        delete order?.observacao;
        delete order?.valorDesconto;
        delete order?.percentualDesconto;
      }

      let produtos: any = [];

      order.produtos.forEach((produto) => {
        if (produto.quantidade > 0) {
          produto.placas &&
            produto.placas.forEach((placa) => {
              produtos.push({
                produto: produto.id,
                quantidade: 1,
                placa: placa.descricao,
                chassi: placa?.chassi,
                marca: placa?.marca,
                modelo: placa?.modelo,
                cor: placa?.cor,
                localEmplacamento: placa?.localEmplacamento,
                placaQuitada: placa.placaQuitada,
                descricao: produto.descricao,
                valorUnitario: produto.valor_venda,
              });
            });
        }
      });

      Object.assign(order, {
        cliente: order.cliente.value,
        vendedor: order.vendedor.value,
        formaPagamento: "bf15170f-f99b-4bb1-be8d-863693a52223",
        valorPedido: order.total,
        valorTotal: Number(order.total),
        status: order.status,
        produtos: produtos,
        servicos: order.servicos,
      });

      const orderNumber = await createOrder(order);

      Object.assign(order, {
        dateCreated: format(new Date(), "dd/MM/yyyy"),
      });

      setCurrentOrderNumber(orderNumber);

      setOrder(order);
      close && close();

      const newOrders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: newOrders });

      switch (order.status) {
        case "ABERTO":
          toast.success("Pedido criado com sucesso!");
          setFinishingModalShouldBeOpen(true);
          return;
        case "QUITADO":
          toast.success("Pedido QUITADO com sucesso!");
          setFinishingModalShouldBeOpen(true);
          return;
        case "CANCELADO":
          toast.success("Pedido CANCELADO com sucesso!");
          return;
        case "RASCUNHO":
          toast.success("Rascunho salvo com sucesso!");
          return;
      }
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro com o pedido.");
      close && close();
    }
  }

  async function importOrder(order: OrderFormData) {
    try {
      dispatch({ type: "LOADING" });
      await createOrder(order);

      const newOrders = await getOrders();
      dispatch({ type: "RELOAD_ORDERS", payload: newOrders });

      toast.success("Importação concluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar arquivo.");
    }
  }

  async function editOrder(order: OrderFormData, close?: () => void) {
    try {
      const findIdOrder = state.orders.find((o) => o.id === order.id);

      if (!findIdOrder) {
        throw new Error("ID Order not found!");
      }

      await removeOrder(findIdOrder.id, "notShowMessage");

      let produtos: any = [];

      const newOrder = {};

      order.produtos.forEach((produto) => {
        if (produto.quantidade > 0) {
          produto.placas &&
            produto.placas.forEach((placa) => {
              produtos.push({
                produto: produto.id,
                quantidade: 1,
                placa: placa.descricao,
                chassi: placa?.chassi,
                marca: placa?.marca,
                modelo: placa?.modelo,
                cor: placa?.cor,
                localEmplacamento: placa?.localEmplacamento,
                placaQuitada: placa.placaQuitada,
                descricao: produto.descricao,
                valorUnitario: produto.valor_venda,
              });
            });
        }
      });

      const totalValue = Number(order.total) - Number(order.desconto || 0);

      Object.assign(newOrder, {
        cliente: order.cliente.value,
        vendedor: order.vendedor.value,
        produtos: produtos,
        numero: order?.numero,
        valorPedido: order.total,
        status: order.status,
        valorTotal: totalValue,
        total: totalValue,
        servicos: order.servicos,
      });

      await createOrder(newOrder as any);

      Object.assign(newOrder, {
        dateCreated: formatDate(order?.dateCreated ?? ""),
      });

      setCurrentOrderNumber(order.numero);

      setOrder(newOrder as any);
      close && close();

      const updatedOrders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: updatedOrders });

      toast.success("Forma de pagamento editada com sucesso!");
      setFinishingModalShouldBeOpen(true);
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar pedido.");
      close && close();
    }
  }

  async function removeOrder(id: string, action?: string) {
    try {
      dispatch({ type: "LOADING" });

      await destroyOrder(id);

      const orders = await getOrders();

      dispatch({ type: "RELOAD_ORDERS", payload: orders });

      if (action && action === "notShowMessage") return;

      toast.success("Pedido removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover pedido.");
    }
  }

  async function filterOrder({ startDate, endDate }: RangeDate) {
    try {
      if (!startDate || !endDate) return;

      dispatch({ type: "LOADING" });

      const orders = await filterOrderByDate(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      dispatch({ type: "RELOAD_ORDERS", payload: orders });

      toast.success(`Foi encontrado um total de ${orders.length} pedidos.`);
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro buscar pedidos.");
    }
  }

  async function setterOrder({
    cliente,
    produtos,
    numero,
    total,
    dateCreated,
  }: SetterOrderProps) {
    setCurrentOrderNumber(numero);
    setOrder({
      cliente,
      dateCreated,
      produtos,
      total,
    });
  }

  return (
    <OrderContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        orders: state.orders,
        order: order,
        actionOrder,
        importOrder,
        editOrder,
        removeOrder,
        filterOrder,
        setterOrder,
        currentOrderNumber,
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
