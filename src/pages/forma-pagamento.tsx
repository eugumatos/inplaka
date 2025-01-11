import { getFormPayments } from "@/services/form-payment";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { FormPayment } from "@/containers/FormPayment";
import { FormPaymentProvider } from "@/contexts/FormPaymentContext";
import { IFormPayment } from "@/domains/form-payment";
import {
  FormPaymentFormData,
  formPaymentFormSchema,
} from "@/schemas/FormPaymentSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const formPayments = await getFormPayments();

  if (!formPayments) {
    return {
      notFound: true,
    };
  }

  return {
    props: { formPayments }, // will be passed to the page component as props
  };
});
