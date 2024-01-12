import { FormProvider, useForm } from "react-hook-form";
import { getPaymentTerms } from "@/services/payment-term";
import { yupResolver } from "@hookform/resolvers/yup";

import { PaymentTerm } from "@/containers/PaymentTerm";
import { PaymentTermProvider } from "@/contexts/PaymentTermContext";
import {
  PaymentTermFormData,
  paymentTermFormSchema,
} from "@/schemas/PaymentTermSchemaValidation";
import { IPaymentTerms } from "@/domains/payment-term";

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

export async function getServerSideProps() {
  const paymentTerms = await getPaymentTerms();

  if (!paymentTerms) {
    return {
      notFound: true,
    };
  }

  return {
    props: { paymentTerms }, // will be passed to the page component as props
  };
}
