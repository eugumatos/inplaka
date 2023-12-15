export interface IService {
  id: string;
  status: string;
  descricao: string;
  valor_venda: number;
  nao_usar_para_nota_fiscal: boolean | string;
  codigo_servico_nfse: string;
  aliquota_nfse: number;
  unidade: string;
  quantidade: number;
}
