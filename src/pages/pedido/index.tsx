import { Order } from "@/containers/Order";
import { OrderProvider } from "@/contexts/OrderContext";
import { IOrder } from "@/domains/order";
import {
  OrderFormData,
  orderFormSchema,
} from "@/schemas/OrderSchemaValidation";
import { getOrders } from "@/services/order";
import { getProducts } from "@/services/product";
import { getServices } from "@/services/service";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

interface HomeProps {
  orders: IOrder[];
}

export default function Pedido({ orders }: HomeProps) {
  const formOrder = useForm<OrderFormData>({
    resolver: yupResolver(orderFormSchema),
  });

  return (
    <OrderProvider orders={orders}>
      <FormProvider {...formOrder}>
        <Order />
      </FormProvider>
    </OrderProvider>
  );
}

export async function getServerSideProps() {
  const orders = await getOrders();
  const products = await getProducts();
  const services = await getServices();

  if (!orders) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      orders,
      products,
      services,
    },
  };
}
