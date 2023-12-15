export interface IProduct {
  id: string;
  status: string;
  controlar_estoque: boolean | string;
  descricao: string;
  valor_venda: string;
  csosn: string;
  ncmsh: string;
  unidade: string;
  codigo_barras: string;
  obriga_placa: boolean | string;
  aliquota_ipi_nfe: string;
  nao_usar_para_nota_fiscal: boolean | string;
  quantidade: number;
  placas: Array<string>;
}
