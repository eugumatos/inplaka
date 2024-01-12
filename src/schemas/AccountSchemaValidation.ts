import * as yup from "yup";

export const accountFormSchema = yup.object().shape({
  descricao: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  saldo: yup.string().required("Campo obrigatório"),
});

export type AccountFormData = yup.InferType<typeof accountFormSchema>;
