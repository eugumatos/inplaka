import * as yup from "yup";

export const clientFormSchema = yup.object().shape({
  razao_social: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  nome: yup.string().required("Campo obrigatório"),
  apelido: yup.string().required("Campo obrigatório"),
});

export type ClientFormData = yup.InferType<typeof clientFormSchema>;
