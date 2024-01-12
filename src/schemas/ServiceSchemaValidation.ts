import * as yup from "yup";

export const serviceFormSchema = yup.object().shape({
  status: yup.string().required("Campo obrigatório"),
  descricao: yup.string().required("Campo obrigatório"),
  valor_venda: yup.string().required("Campo obrigatório"),
  nao_usar_para_nota_fiscal: yup.string().required("Campo obrigatório"),
  codigo_servico_nfse: yup.number().required("Campo obrigatório"),
  aliquota_nfse: yup.string().required("Campo obrigatório"),
  unidade: yup.string().required("Campo obrigatório"),
});

export type ServiceFormData = yup.InferType<typeof serviceFormSchema>;
