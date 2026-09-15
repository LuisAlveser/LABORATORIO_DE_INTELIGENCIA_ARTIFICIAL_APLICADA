import {api} from "../api"


export const ExcluirCriancaServico = {
  excluir: async (id: string, token: string) => {
    const response = await api.delete(`/crianca/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};