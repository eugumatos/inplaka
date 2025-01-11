import { getServices } from "@/services/service";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Service } from "@/containers/Service";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { IService } from "@/domains/service";
import {
  ServiceFormData,
  serviceFormSchema,
} from "@/schemas/ServiceSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface ServiceProps {
  services: IService[];
}

export default function Servico({ services }: ServiceProps) {
  const service = useForm<ServiceFormData>({
    resolver: yupResolver(serviceFormSchema),
  });

  return (
    <ServiceProvider services={services}>
      <FormProvider {...service}>
        <Service />
      </FormProvider>
    </ServiceProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const services = await getServices();

  if (!services) {
    return {
      notFound: true,
    };
  }

  return {
    props: { services }, // will be passed to the page component as props
  };
});
