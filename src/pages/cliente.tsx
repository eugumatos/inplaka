import { getClients } from "@/services/clients";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Client } from "@/containers/Client";
import { ClientProvider } from "@/contexts/ClientContext";
import { IClient } from "@/domains/client";
import {
  ClientFormData,
  clientFormSchema,
} from "@/schemas/ClientSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const clients = await getClients();

  if (!clients) {
    return {
      notFound: true,
    };
  }

  return {
    props: { clients }, // will be passed to the page component as props
  };
});
