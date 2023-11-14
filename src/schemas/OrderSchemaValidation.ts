import * as yup from "yup";

export const orderFormSchema = yup.object().shape({
  cliente: yup.string().required("Campo obrigatório"),
  vendedor: yup.string().required("Campo obrigatório"),
  formaPagamento: yup.string(),
  desconto: yup.number(),
});

export type OrderFormData = yup.InferType<typeof orderFormSchema>;
