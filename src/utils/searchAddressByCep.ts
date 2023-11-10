import { viacep_url } from "@/constants";

interface AddressResponse {
  uf: string;
  bairro: string;
  localidade: string;
  logradouro: string;
}

export const searchAddressByCep = async (
  cep: string
): Promise<AddressResponse> => {
  try {
    const res = await fetch(`${viacep_url}/${cep}/json`);

    return res.json();
  } catch (error) {
    throw "Zip code invalid or nonexistent";
  }
};
