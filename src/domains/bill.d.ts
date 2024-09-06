export interface IBill {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  nome_Conta: string;
  descrição: string;
  fornecedor: string;
  documento: string;
  parcela: number;
  data_Emissao: string;
  data_Vencimento: string;
  data_Pagamento: string;
  valor: number;
  recorrente: boolean;
  forma_Pagamento: string;
}
