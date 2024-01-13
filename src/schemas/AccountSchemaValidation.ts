import * as yup from "yup";

export const accountFormSchema = yup.object().shape({
  descricao: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  saldo: yup.string().required("Campo obrigatório"),
  numero: yup.number(),
  agencia: yup.string(),
  banco: yup.string(),
});

export type AccountFormData = yup.InferType<typeof accountFormSchema>;
