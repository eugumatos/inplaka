export interface IStock {
  id: string;
  codigoMovimento: string;
  descricao: string;
  produto: string;
  quantidade: number;
  saldoAnterior: number;
  saldoAtual: number;
}
