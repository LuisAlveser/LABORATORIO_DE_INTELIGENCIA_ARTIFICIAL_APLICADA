import { api } from "../api"


export const AtualizarCriancaServico = {
  atualizar: async (id: string, dados: any, token: string) => {
    const response = await api.patch(`/crianca/${id}`, dados, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};