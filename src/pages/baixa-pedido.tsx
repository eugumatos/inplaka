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
  clients: IClient[];
  plaques: any;
}

export default function BaixaPlaca({ clients, plaques }: HomeProps) {
  const formPlaque = useForm({
    resolver: yupResolver(plaqueFormSchema),
  });

  return (
    <FormProvider {...formPlaque}>
      <Plaque clients={clients} plaques={plaques} />
    </FormProvider>
  );
}

export async function getServerSideProps() {
  const clients = await getClients();
  const plaques = await getAllPlaques();

  const formattedPlaques = plaques.map((p: any) => {
    return {
      ...p,
      numero: p?.pedidoVendaNumero,
      clienteNome: p?.pedidoVendaClienteNome
    }
  })

  return {
    props: {
      clients,
      plaques: formattedPlaques,
    },
  };
}
