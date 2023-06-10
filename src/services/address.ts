
import { ViaCepReturn } from '@/types/viaCep';
import Axios from 'axios';

async function getByCep(cep: string): Promise<ViaCepReturn | undefined> {
  try {
    const { data } = await Axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (data.erro) return undefined;

    return {
      city: data.localidade,
      neighborhood: data.bairro,
      state: data.uf,
      street: data.logradouro,
    };
  } catch {
    return undefined;
  }
}

async function getAllStates(): Promise<string[]> {
  return Axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  ).then(({ data }) => {
    return data.map(({ sigla }: any) => sigla);
  });
}

async function getCitiesByState(state: string): Promise<string[]> {
  return Axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
  ).then(({ data }) => {
    return data.map(({ nome }: any) => nome);
  });
}

export const addressService = {
  getByCep,
  getAllStates,
  getCitiesByState,
};
