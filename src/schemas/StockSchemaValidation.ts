import * as yup from "yup";

export const stockFormSchema = yup.object().shape({
  codigoMovimento: yup.string(),
  descricao: yup.string().nullable().optional(),
  produto: yup.string(),
  produtoNome: yup.string().nullable().optional(),
  quantidade: yup.number(),
});

export type StockFormData = yup.InferType<typeof stockFormSchema>;
