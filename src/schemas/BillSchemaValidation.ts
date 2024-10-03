import * as yup from "yup";

export const billFormSchema = yup.object().shape({
  nome_conta: yup.string().required("Campo obrigatório"),
  descricao: yup.string().required("Campo obrigatório"),
  documento: yup.string().required("Campo obrigatório"),
  parcela: yup.string().required("Campo obrigatório"),
  data_emissao: yup.string().required("Campo obrigatório"),
  data_vencimento: yup.string().required("Campo obrigatório"),
  valor: yup.string().required("Campo obrigatório"),
  recorrente: yup.boolean().required("Campo obrigatório"),
  fornecedor: yup.object().shape({
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

export type BillFormData = yup.InferType<typeof billFormSchema>;
