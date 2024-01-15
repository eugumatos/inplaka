import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";
import * as yup from "yup";

export const orderFormSchema = yup.object().shape({
  cliente: yup.string().required("Campo obrigatório"),
  vendedor: yup.string().required("Campo obrigatório"),
  formaPagamento: yup.string().required("Campo obrigatório"),
  desconto: yup.string(),
  id: yup.string(),
});

export type IOrderFormData = yup.InferType<typeof orderFormSchema>;

export interface OrderFormData extends IOrderFormData {
  produtos: IProduct[];
  servicos: IService[];
  total: number;
}
