import { FormProvider, useForm } from "react-hook-form";
import { getServices } from "@/services/service";
import { yupResolver } from "@hookform/resolvers/yup";

import { Service } from "@/containers/Service";
import { ServiceProvider } from "@/contexts/ServiceContext";
import {
  ServiceFormData,
  serviceFormSchema,
} from "@/schemas/ServiceSchemaValidation";
import { IService } from "@/domains/service";

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

export async function getServerSideProps() {
  const services = await getServices();

  if (!services) {
    return {
      notFound: true,
    };
  }

  return {
    props: { services }, // will be passed to the page component as props
  };
}
