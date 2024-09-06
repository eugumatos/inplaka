import { FormProvider, useForm } from "react-hook-form";
import { getBills } from "@/services/biils";
import { yupResolver } from "@hookform/resolvers/yup";

import { Bill } from "@/containers/Bill";
import { BillProvider } from "@/contexts/BillContext";
import { BillFormData, billFormSchema } from "@/schemas/BillSchemaValidation";
import { IBill } from "@/domains/bill";

interface BillProps {
  bills: IBill[];
}

export default function ContaPagar({ bills }: BillProps) {
  const account = useForm<BillFormData>({
    resolver: yupResolver(billFormSchema),
  });

  return (
    <BillProvider bills={bills}>
      <FormProvider {...account}>
        <Bill />
      </FormProvider>
    </BillProvider>
  );
}

export async function getServerSideProps() {
  const accounts = await getBills();

  if (!accounts) {
    return {
      notFound: true,
    };
  }

  return {
    props: { accounts },
  };
}
