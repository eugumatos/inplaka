import * as yup from "yup";

export const clientFormSchema = yup.object().shape({
  razao_social: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  nome: yup.string().required("Campo obrigatório"),
  apelido: yup.string().required("Campo obrigatório"),
  cnpj: yup.string(),
  rg_ie: yup.string(),
  matricula: yup.string(),
  consumidor_final: yup.string(),
  vendedorPadrao: yup.object(),
  ender_uf: yup.string(),
  ender_cep: yup.string(),
  ender_bairro: yup.string(),
  ender_cidade: yup.string(),
  ender_logradouro: yup.string(),
  ender_complemento: yup.string(),
  ender_numero: yup.string(),
  email: yup.string(),
  celular: yup.string(),
  telefone1: yup.string(),
  telefone2: yup.string(),
});

export type ClientFormData = yup.InferType<typeof clientFormSchema>;
