export interface IClient {
  razao_social: string;
  status: string;
  nome: string;
  apelido: string;
  telefone: string;
  celular: string;
  cpf_cnpj: string;
  rg_ie: string;
  email: string;
  ender_cep: string;
  ender_logradouro: string;
  ender_numero: string;
  ender_complemento: string;
  ender_bairro: string;
  ender_cidade: string;
  ender_uf: string;
  ender_cod_municipio: string;
  consumidor_final: boolean | string;
  matricula: string;
  vendedorPadrao: number;
  observacao: string;
  id: string;
  dateCreated: string;
  dateUpdated: string;
}
