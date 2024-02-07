import * as yup from "yup";

export const stockFormSchema = yup.object().shape({
  codigoMovimento: yup.string(),
  descricao: yup.string(),
  produto: yup.string(),
  quantidade: yup.number(),
});

export type StockFormData = yup.InferType<typeof stockFormSchema>;
