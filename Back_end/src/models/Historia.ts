import strict from "assert/strict";
import { Crianca } from "./Crianca";



export interface PropHistoria {
    id?: string; 
    crianca_id: string; 
    prompt_pai: string;
    paginas: PaginaHistoria[]; 
    criado_em?: Date;
}
export interface HitoriaExibicao {
 crianca_id  :  string,
  prompt_pai  :  string
  temas_identificados: string[]
  paginas          :   PaginaHistoria[] 
}
export interface PaginaHistoria {
  numero: number;
  texto: string;
  imagem_url?: string | null; 
}

