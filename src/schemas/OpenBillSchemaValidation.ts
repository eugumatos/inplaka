import * as yup from "yup";

export const openBillFormSchema = yup.object().shape({
  descricao: yup.string(),
  documento: yup.string(),
  parcela: yup.string(),
  data_vencimento: yup.string(),
  data_pagamento: yup.string().required("Campo obrigatório"),
  valor: yup.string(),
  valor_pago: yup.string(),
  forma_pagamento: yup.object().shape({
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

export type OpenBillFormData = yup.InferType<typeof openBillFormSchema>;
