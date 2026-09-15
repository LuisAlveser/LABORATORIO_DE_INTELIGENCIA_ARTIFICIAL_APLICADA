import {api} from "../api"


export const listarCriancaServico = {
  listar: async (token:string) => {
    const response = await api.get('/crianca/',{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  },
};