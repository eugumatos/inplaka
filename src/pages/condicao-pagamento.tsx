import { getPaymentTerms } from "@/services/payment-term";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { PaymentTerm } from "@/containers/PaymentTerm";
import { PaymentTermProvider } from "@/contexts/PaymentTermContext";
import { IPaymentTerms } from "@/domains/payment-term";
import {
  PaymentTermFormData,
  paymentTermFormSchema,
} from "@/schemas/PaymentTermSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface PaymentTermProps {
  paymentTerms: IPaymentTerms[];
}

export default function CondicaoPagamento({ paymentTerms }: PaymentTermProps) {
  const paymentTerm = useForm<PaymentTermFormData>({
    resolver: yupResolver(paymentTermFormSchema),
  });

  return (
    <PaymentTermProvider paymentTerms={paymentTerms}>
      <FormProvider {...paymentTerm}>
        <PaymentTerm />
      </FormProvider>
    </PaymentTermProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const paymentTerms = await getPaymentTerms();

  if (!paymentTerms) {
    return {
      notFound: true,
    };
  }

  return {
    props: { paymentTerms }, // will be passed to the page component as props
  };
});
