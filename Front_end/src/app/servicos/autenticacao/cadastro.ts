import {api} from "../api"
import {CadastroFormData} from "../../index"

export const cadastroServico = {
  cadastrar: async (dados: CadastroFormData) => {
    const response = await api.post('/responsavel/cadastro', dados);
    return response.data;
  },
};