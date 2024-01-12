import * as yup from "yup";

const paymentTermFormSchema = yup.object().shape({
  descricao: yup.string().required("Campo obrigatório"),
  quantidade_parcelas: yup.string().required("Campo obrigatório"),
  dias_entre_parcelas: yup.string().required("Campo obrigatório"),
  plano_contas: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
});

export type PaymentTermFormData = yup.InferType<typeof paymentTermFormSchema>;
