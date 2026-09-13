import { Crianca } from "./Crianca";

export interface PropResponsavel {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    crianca?: Crianca[];
}


