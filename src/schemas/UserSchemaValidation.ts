import * as yup from "yup";

const userFormSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  email: yup.string().required("Campo obrigatório"),
  password: yup.string().required("Campo obrigatório"),
  role: yup.string().required("Campo obrigatório"),
});

export type UserFormData = yup.InferType<typeof userFormSchema>;
