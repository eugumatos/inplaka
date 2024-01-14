import * as yup from "yup";

export const paymentTermFormSchema = yup.object().shape({
  descricao: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  quantidade_parcelas: yup.string(),
  dias_entre_parcelas: yup.string(),
  plano_contas: yup.string(),
});

export type PaymentTermFormData = yup.InferType<typeof paymentTermFormSchema>;
