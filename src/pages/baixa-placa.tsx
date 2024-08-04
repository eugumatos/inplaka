import { Plaque } from "@/containers/Plaque";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";
import { plaqueFormSchema } from "@/schemas/PlaqueSchemaValidation";
import { getClients } from "@/services/clients";
import { getOrders } from "@/services/order";
import { getAllPlaques } from "@/services/plaque";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface IPlaques {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  pedidoVenda: string;
  pedidoVendaClienteNome: string;
  pedidoVendaNumero: number;
  pedidoVendaData: Date;
  valorAbatido: number;
  formaPagamento: string;
  formaPagamentoNome: string;
  dataRecebimento: Date;
  valorTotal: number;
  valorEmAbertoAnterior: number;
  valorEmAbertoAtual: number;
}

interface HomeProps {
  orders: IOrder[];
  clients: IClient[];
  plaques: IPlaques[];
}

export default function BaixaPlaca({ orders, clients, plaques }: HomeProps) {
  const formPlaque = useForm({
    resolver: yupResolver(plaqueFormSchema),
  });

  return (
    <FormProvider {...formPlaque}>
      <Plaque orders={orders} clients={clients} plaques={plaques} />
    </FormProvider>
  );
}

export async function getServerSideProps() {
  const orders = await getOrders();
  const clients = await getClients();
  const plaques = await getAllPlaques();

  if (!orders) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      orders,
      clients,
      plaques,
    },
  };
}
