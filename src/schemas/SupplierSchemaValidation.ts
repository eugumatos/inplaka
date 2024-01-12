import * as yup from "yup";

const supplierFormSchema = yup.object().shape({
  nome: yup.string().required("Campo obrigatório"),
  apelido: yup.string().required("Campo obrigatório"),
  status: yup.string().required("Campo obrigatório"),
});

export type SupplierFormData = yup.InferType<typeof supplierFormSchema>;
