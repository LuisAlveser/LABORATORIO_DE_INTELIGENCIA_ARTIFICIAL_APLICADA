import {api} from "../api"


export const CadastrarCriancaServico = {
  cadastrar: async (dados: any,token:string) => {
    const response = await api.post('/crianca/', dados,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};