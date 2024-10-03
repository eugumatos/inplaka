import { getOpenBillsInstalment } from "@/services/biils";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IOpenBill } from "@/domains/open-bill";
import { openBillFormSchema } from "@/schemas/OpenBillSchemaValidation";
import { OpenBill } from "@/containers/OpenBill";
import { OpenBillProvider } from "@/contexts/OpenBillContext";

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

export async function getServerSideProps() {
  const openBills = await getOpenBillsInstalment();

  return {
    props: {
      openBills,
    },
  };
}
