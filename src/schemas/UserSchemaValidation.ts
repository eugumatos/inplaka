import * as yup from "yup";

export const userFormSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  email: yup.string().required("Campo obrigatório"),
  password: yup.string().required("Campo obrigatório"),
  role: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
});

export type UserFormData = yup.InferType<typeof userFormSchema>;
