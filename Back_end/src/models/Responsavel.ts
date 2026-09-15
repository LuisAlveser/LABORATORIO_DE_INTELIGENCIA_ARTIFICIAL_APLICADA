import { Crianca } from "./Crianca";


export interface Responsavel {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    crianca?: Crianca[];
}


