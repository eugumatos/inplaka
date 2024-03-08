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
  valorDesconto: yup.string(),
  desconto: yup.string(),
  status: yup.string(),
  id: yup.string(),
});

export type IOrderFormData = yup.InferType<typeof orderFormSchema>;

export interface OrderFormData extends IOrderFormData {
  produtos: IProduct[];
  servicos: IService[];
  total: number;
}
