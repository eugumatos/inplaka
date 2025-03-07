import { Order } from "@/containers/Order";
import { OrderProvider } from "@/contexts/OrderContext";
import { IOrder } from "@/domains/order";
import {
  IOrderFormData,
  orderFormSchema,
} from "@/schemas/OrderSchemaValidation";
import { getOrders } from "@/services/order";
import { getProducts } from "@/services/product";
import { getServices } from "@/services/service";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

interface HomeProps {
  orders: IOrder[];
}

export default function Pedido({ orders }: HomeProps) {
  const formOrder = useForm<IOrderFormData>({
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

export const getServerSideProps = withSSRAuth(async (ctx) => {
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
});
