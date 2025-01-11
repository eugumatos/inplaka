import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Stock } from "@/containers/Stock";
import { StockProvider } from "@/contexts/StockContext";
import { IStock } from "@/domains/stock";
import {
  StockFormData,
  stockFormSchema,
} from "@/schemas/StockSchemaValidation";
import { getStock } from "@/services/stock";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface StockProps {
  stock: IStock[];
}

export default function Estoque({ stock }: StockProps) {
  const stockForm = useForm<StockFormData>({
    resolver: yupResolver(stockFormSchema),
  });

  return (
    <StockProvider stock={stock}>
      <FormProvider {...stockForm}>
        <Stock />
      </FormProvider>
    </StockProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const stock = await getStock();

  if (!stock) {
    return {
      notFound: true,
    };
  }

  return {
    props: { stock }, // will be passed to the page component as props
  };
});
