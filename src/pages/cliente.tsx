import { FormProvider, useForm } from "react-hook-form";
import { getClients } from "@/services/clients";
import { yupResolver } from "@hookform/resolvers/yup";

import { Client } from "@/containers/Client";
import { ClientProvider } from "@/contexts/ClientContext";
import {
  ClientFormData,
  clientFormSchema,
} from "@/schemas/ClientSchemaValidation";
import { IClient } from "@/domains/client";

interface ClientProps {
  clients: IClient[];
}

export default function Cliente({ clients }: ClientProps) {
  const client = useForm<ClientFormData>({
    resolver: yupResolver(clientFormSchema),
  });

  return (
    <ClientProvider clients={clients}>
      <FormProvider {...client}>
        <Client />
      </FormProvider>
    </ClientProvider>
  );
}

export async function getServerSideProps() {
  const clients = await getClients();

  if (!clients) {
    return {
      notFound: true,
    };
  }

  return {
    props: { clients }, // will be passed to the page component as props
  };
}
