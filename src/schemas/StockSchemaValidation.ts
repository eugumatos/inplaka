import * as yup from "yup";

export const stockFormSchema = yup.object().shape({
  codigoMovimento: yup.string(),
  descricao: yup.string().nullable().optional(),
  produto: yup.string(),
  produtoNome: yup.string().nullable().optional(),
  quantidade: yup.number(),
  saldoAtual: yup.string().nullable().optional(),
});

export type StockFormData = yup.InferType<typeof stockFormSchema>;
