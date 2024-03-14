interface IPlaque {
  localEmplacamento?: string;
  cor?: string;
  modelo?: string;
  marca?: string;
  chassi?: string;
  descricao: string;
  placaQuitada: boolean;
}

export interface IProduct {
  id: string;
  status?: string;
  controlar_estoque: boolean | string;
  descricao: string;
  valor_venda: string;
  produto?: string;
  csosn: string;
  ncmsh: string;
  unidade: string;
  codigo_barras: string;
  obriga_placa: boolean | string;
  aliquota_ipi_nfe: string;
  nao_usar_para_nota_fiscal: boolean | string;
  quantidade: number;
  placa: string;
  placas: Array<IPlaque> | undefined;
  placaQuitada: boolean;
  chassi?: string;
  marca?: string;
  modelo?: string;
  localEmplacamento?: string;
}
