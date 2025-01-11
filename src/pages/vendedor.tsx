import { getSellers } from "@/services/seller";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Seller } from "@/containers/Seller";
import { SellerProvider } from "@/contexts/SellerContext";
import { ISeller } from "@/domains/seller";
import {
  SellerFormData,
  sellerFormSchema,
} from "@/schemas/SellerSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface SellerProps {
  sellers: ISeller[];
}

export default function Vendedor({ sellers }: SellerProps) {
  const seller = useForm<SellerFormData>({
    resolver: yupResolver(sellerFormSchema),
  });

  return (
    <SellerProvider sellers={sellers}>
      <FormProvider {...seller}>
        <Seller />
      </FormProvider>
    </SellerProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const sellers = await getSellers();

  if (!sellers) {
    return {
      notFound: true,
    };
  }

  return {
    props: { sellers }, // will be passed to the page component as props
  };
});
