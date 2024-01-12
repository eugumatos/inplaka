import { FormProvider, useForm } from "react-hook-form";
import { getSellers } from "@/services/seller";
import { yupResolver } from "@hookform/resolvers/yup";

import { Seller } from "@/containers/Seller";
import { SellerProvider } from "@/contexts/SellerContext";
import {
  SellerFormData,
  sellerFormSchema,
} from "@/schemas/SellerSchemaValidation";
import { ISeller } from "@/domains/seller";

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

export async function getServerSideProps() {
  const sellers = await getSellers();

  if (!sellers) {
    return {
      notFound: true,
    };
  }

  return {
    props: { sellers }, // will be passed to the page component as props
  };
}
