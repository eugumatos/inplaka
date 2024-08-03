import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";
import * as yup from "yup";

export const orderFormSchema = yup.object().shape({
  cliente: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
  vendedor: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
  formaPagamento: yup.object().shape({
    value: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
    label: yup
      .string()
      .nullable("Campo obrigatório")
      .required("Campo obrigatório"),
  }),
  servico: yup.string(),
  servicoValor: yup.string(),
  dateCreated: yup.string(),
  valorDesconto: yup.string(),
  desconto: yup.string(),
  status: yup.string(),
  id: yup.string(),
});

export type IOrderFormData = yup.InferType<typeof orderFormSchema>;

export interface OrderFormData extends IOrderFormData {
  valorTotal: number;
  produtos: IProduct[];
  formaPagamentoNome?: string;
  clienteNome?: string;
  observacao?: string;
  percentualDesconto?: string;
  servicos: Array<{
    servico: string;
    quantidade: number;
    descricao: string;
    valorUnitario: number;
    valorTotal: number;
    observacao: string;
  }>;
  total: number;
  numero: number;
}
