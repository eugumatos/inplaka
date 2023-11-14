import * as yup from "yup";

export const formPaymentFormSchema = yup.object().shape({
  descricao: yup.string().required("Campo obrigatório"),
  plano_contas: yup.string().required("Campo obrigatório"),
  status: yup.string(),
});

export type FormPaymentFormData = yup.InferType<typeof formPaymentFormSchema>;
