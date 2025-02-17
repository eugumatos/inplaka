import { getSuppliers } from "@/services/supplier";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Supplier } from "@/containers/Supplier";
import { SupplierProvider } from "@/contexts/SupplierContext";
import { ISupplier } from "@/domains/supplier";
import {
  SupplierFormData,
  supplierFormSchema,
} from "@/schemas/SupplierSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface SupplierProps {
  suppliers: ISupplier[];
}

export default function Fornecedor({ suppliers }: SupplierProps) {
  const supplier = useForm<SupplierFormData>({
    resolver: yupResolver(supplierFormSchema),
  });

  return (
    <SupplierProvider suppliers={suppliers}>
      <FormProvider {...supplier}>
        <Supplier />
      </FormProvider>
    </SupplierProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const suppliers = await getSuppliers();

  if (!suppliers) {
    return {
      notFound: true,
    };
  }

  return {
    props: { suppliers }, // will be passed to the page component as props
  };
});
