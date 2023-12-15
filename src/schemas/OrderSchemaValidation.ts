import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";
import * as yup from "yup";

export const orderFormSchema = yup.object().shape({
  cliente: yup.string().required("Campo obrigatório"),
  vendedor: yup.string().required("Campo obrigatório"),
  formaPagamento: yup.string(),
  desconto: yup.number(),
  produtos: yup.object(),
  servicos: yup.object(),
  id: yup.string(),
});

type IOrderFormData = yup.InferType<typeof orderFormSchema>;

export interface OrderFormData extends IOrderFormData {
  produtos: IProduct[];
  servicos: IService[];
  total: number;
}
