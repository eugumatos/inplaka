import * as yup from "yup";

export const accountReportFormSchema = yup.object().shape({
  data_inicio: yup.string(),
  data_fim: yup.string(),
  contaBancaria: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório"),
  }),
});

export type AccountReportFormData = yup.InferType<typeof accountReportFormSchema>;
