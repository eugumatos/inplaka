export interface IFormPayment {
  id: string;
  descricao: string;
  plano_contas: string;
  status: string;
}

export interface FormPayments {
  formPayments: IFormPayment[];
}
