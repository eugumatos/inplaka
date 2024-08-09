import * as yup from "yup";

export const plaqueFormSchema = yup.object().shape({
  valorEmAbertoAtual: yup.string(),
  valorTotal: yup.string(),
  valorAbatido: yup.string(),
  dataRecebimento: yup.string(),
  conta: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
  formaPagamento: yup.object().shape({
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

export type PlaqueFormData = yup.InferType<typeof plaqueFormSchema>;
