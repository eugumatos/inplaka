import * as yup from "yup";

export const salleFormSchema = yup.object().shape({
  status: yup.string().required("Campo obrigatório"),
  numero_pedido: yup.string().required("Campo obrigatório"),
  valorAbatido: yup.string().required("Campo obrigatório"),
  data_inicio: yup.string().required("Campo obrigatório"),
  data_fim: yup.string().required("Campo obrigatório"),
  cliente: yup.object().shape({
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

export type SalleFormData = yup.InferType<typeof salleFormSchema>;
