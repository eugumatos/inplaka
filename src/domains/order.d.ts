export interface IOrder {
  [x: string]: any;
  id: string;
  cliente: string;
  vendedor: string;
  formaPagamento?: string;
  valorPedido: number;
  valorDesconto: number;
  percentualDesconto: number;
  valorTotal?: number;
  status?: string;
  observacao?: string;
  produtos?: Array<{
    produto: string;
    quantidade: number;
    placa?: string;
    descricao?: string;
    valorUnitario?: number;
  }>;
  servicos?: Array<{
    servico: string;
    quantidade: number;
    placa?: string;
    descricao?: string;
    valorUnitario?: number;
  }>;
}
