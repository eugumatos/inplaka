import * as yup from "yup";

export const accountFormSchema = yup.object().shape({
  numero: yup.string().notRequired(),
  agencia: yup.string(),
  banco: yup.string(),
  descricao: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  saldo: yup.string().required("Campo obrigatório"),
});

export type AccountFormData = yup.InferType<typeof accountFormSchema>;
