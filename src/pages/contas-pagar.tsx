import { getBills } from "@/services/biils";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Bill } from "@/containers/Bill";
import { BillProvider } from "@/contexts/BillContext";
import { IBill } from "@/domains/bill";
import { BillFormData, billFormSchema } from "@/schemas/BillSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const bills = await getBills();

  if (!bills) {
    return {
      notFound: true,
    };
  }

  return {
    props: { bills },
  };
});
