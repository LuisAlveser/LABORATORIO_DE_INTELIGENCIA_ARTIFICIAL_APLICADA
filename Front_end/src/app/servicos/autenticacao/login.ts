import {api} from "../api"
import {LoginFormData} from "../../login"


export const loginServico = {
  login: async (dados: LoginFormData) => {
    const response = await api.post('/responsavel/login', dados);
    return response.data;
  },
};