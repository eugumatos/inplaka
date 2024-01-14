import * as yup from "yup";

export const sellerFormSchema = yup.object().shape({
  nome: yup.string().required("Campo obrigatório"),
  apelido: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  rg: yup.string(),
  cpf: yup.string(),
  celular: yup.string(),
  telefone: yup.string(),
  ender_uf: yup.string(),
  ender_cep: yup.string(),
  ender_bairro: yup.string(),
  ender_cidade: yup.string(),
  ender_logradouro: yup.string(),
  ender_complemento: yup.string(),
  ender_numero: yup.string(),
});

export type SellerFormData = yup.InferType<typeof sellerFormSchema>;
