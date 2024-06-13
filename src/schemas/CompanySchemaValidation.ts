import * as yup from "yup";

export const companyFormSchema = yup.object().shape({
  cnpj: yup.string().required("Campo obrigatório"),
  fantasia: yup.string().required("Campo obrigatório"),
  razao_social: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido"),
  ender_numero: yup.string().max(5, "Máximo 5 char"),
  id: yup.string(),
  ender_uf: yup.string(),
  telefone1: yup.string(),
  telefone2: yup.string(),
  celular: yup.string(),
  ender_cep: yup.string(),
  ender_logradouro: yup.string(),
  ender_complemento: yup.string(),
  ender_bairro: yup.string(),
  ender_cidade: yup.string(),
});

export type CompanyFormData = yup.InferType<typeof companyFormSchema>;
