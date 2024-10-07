import * as yup from "yup";

export const openBillFormSchema = yup.object().shape({
  id: yup.string(),
  id_Conta: yup.string(),
  descricao: yup.string(),
  nro_Parcela: yup.string(),
  documento: yup.string(),
  parcela: yup.string(),
  status: yup.string(),
  valor_Parcela: yup.string(),
  data_Vencimento: yup.string(),
  data_pagamento: yup.string().required("Campo obrigatório"),
  valor: yup.string(),
  valor_Pago: yup.string(),
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
