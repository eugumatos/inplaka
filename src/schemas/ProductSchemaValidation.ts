import * as yup from "yup";

export const productFormSchema = yup.object().shape({
  controlar_estoque: yup.string().required("Campo obrigatório"),
  valor_venda: yup.string().required("Campo obrigatório"),
  aliquota_ipi_nfe: yup.string().required("Campo obrigatório"),
  descricao: yup.string().required("Campo obrigatório"),
  unidade: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
});

export type ProductFormData = yup.InferType<typeof productFormSchema>;
