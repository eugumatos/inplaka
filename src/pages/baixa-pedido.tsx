import { Plaque } from "@/containers/Plaque";
import { IClient } from "@/domains/client";
import { plaqueFormSchema } from "@/schemas/PlaqueSchemaValidation";
import { getClients } from "@/services/clients";
import { getAllPlaques } from "@/services/plaque";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

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

  const formattedPlaques = plaques.filter((p: any) => p.valorEmAbertoAtual > 0);

  return {
    props: {
      clients,
      plaques: formattedPlaques,
    },
  };
}
