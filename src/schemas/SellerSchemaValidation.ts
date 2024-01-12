import * as yup from "yup";

export const sellerFormSchema = yup.object().shape({
  nome: yup.string().required("Campo obrigatório"),
  apelido: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
});

export type SellerFormData = yup.InferType<typeof sellerFormSchema>;
