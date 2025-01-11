import { OpenBill } from "@/containers/OpenBill";
import { OpenBillProvider } from "@/contexts/OpenBillContext";
import { IOpenBill } from "@/domains/open-bill";
import { openBillFormSchema } from "@/schemas/OpenBillSchemaValidation";
import { getOpenBillsInstalment } from "@/services/biils";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

interface OpenBillsProps {
  openBills: IOpenBill[];
}

export default function BaixaContas({ openBills }: OpenBillsProps) {
  const formOpenBill = useForm({
    resolver: yupResolver(openBillFormSchema),
  });

  return (
    <OpenBillProvider openBills={openBills}>
      <FormProvider {...formOpenBill}>
        <OpenBill />
      </FormProvider>
    </OpenBillProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const openBills = await getOpenBillsInstalment();

  return {
    props: {
      openBills,
    },
  };
});
