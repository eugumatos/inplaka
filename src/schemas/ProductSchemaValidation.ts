import * as yup from "yup";

export const productFormSchema = yup.object().shape({
  controlar_estoque: yup.string().required("Campo obrigatório"),
  valor_venda: yup.string().required("Campo obrigatório"),
  aliquota_ipi_nfe: yup.string().required("Campo obrigatório"),
  descricao: yup.string().required("Campo obrigatório"),
  unidade: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
  csosn: yup.string(),
  ncmsh: yup.string(),
  codigo_barras: yup.string(),
  obriga_placa: yup.string(),
  nao_usar_para_nota_fiscal: yup.string(),
});

export const productByClientSchema = yup.object().shape({
  valor_venda_cliente: yup.string().required("Campo obrigatório"),
  produto: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
    idCliente: yup.string(),
    descricao: yup.string(),
    valor_venda: yup.string(),
});

export type ProductFormData = yup.InferType<typeof productFormSchema>;

export type ProductFormByClientData = yup.InferType<typeof productByClientSchema>;
