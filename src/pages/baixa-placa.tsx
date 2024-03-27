import { Plaque } from "@/containers/Plaque";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";
import { getClients } from "@/services/clients";
import { getOrders } from "@/services/order";

interface HomeProps {
  orders: IOrder[];
  clients: IClient[];
}

export default function BaixaPlaca({ orders, clients }: HomeProps) {
  return <Plaque orders={orders} clients={clients} />;
}

export async function getServerSideProps() {
  const orders = await getOrders();
  const clients = await getClients();

  if (!orders) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      orders,
      clients,
    },
  };
}
