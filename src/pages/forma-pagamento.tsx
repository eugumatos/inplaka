import { FormProvider, useForm } from "react-hook-form";
import { getFormPayments } from "@/services/form-payment";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  FormPaymentFormData,
  formPaymentFormSchema,
} from "@/schemas/FormPaymentSchemaValidation";
import { FormPayment } from "@/containers/FormPayment";
import { FormPaymentProvider } from "@/contexts/FormPaymentContext";
import { IFormPayment } from "@/domains/form-payment";

interface FormPaymentProps {
  formPayments: IFormPayment[];
}

export default function FormaPagamento({ formPayments }: FormPaymentProps) {
  const formPayment = useForm<FormPaymentFormData>({
    resolver: yupResolver(formPaymentFormSchema),
  });

  return (
    <FormPaymentProvider formPayments={formPayments}>
      <FormProvider {...formPayment}>
        <FormPayment />
      </FormProvider>
    </FormPaymentProvider>
  );
}

export async function getServerSideProps() {
  const formPayments = await getFormPayments();

  if (!formPayments) {
    return {
      notFound: true,
    };
  }

  return {
    props: { formPayments }, // will be passed to the page component as props
  };
}
