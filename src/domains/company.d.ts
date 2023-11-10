export interface ICompany {
  razao_social: string;
  fantasia: string;
  telefone1: string;
  telefone2: string;
  celular: string;
  cnpj: string;
  email: string;
  ender_cep: string;
  ender_logradouro: string;
  ender_numero: string;
  ender_complemento: string;
  ender_bairro: string;
  ender_cidade: string;
  ender_uf: string;
  id: string;
}

interface RequiredFields {
  cnpj: string;
  fantasia: string;
  razao_social: string;
}

export type ICompanyKeys = keyof ICompany;
