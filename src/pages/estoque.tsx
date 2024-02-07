import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { getStock } from "@/services/stock";
import { Stock } from "@/containers/Stock";
import { StockProvider } from "@/contexts/StockContext";
import { IStock } from "@/domains/stock";
import {
  StockFormData,
  stockFormSchema,
} from "@/schemas/StockSchemaValidation";

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

export async function getServerSideProps() {
  const stock = await getStock();

  if (!stock) {
    return {
      notFound: true,
    };
  }

  return {
    props: { stock }, // will be passed to the page component as props
  };
}
