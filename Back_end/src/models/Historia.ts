import { Crianca } from "./Crianca";

export interface PaginaHistoria {
    numero: number;
    texto: string;
    imagem_url?: string;
}

export interface PropHistoria {
    id?: string; 
    crianca_id: string; 
    prompt_pai: string;
    paginas: PaginaHistoria[]; 
    criado_em: Date;
}

export class Historia {
    constructor(private readonly prop: PropHistoria) {}

    public getId(): string | undefined {
        return this.prop.id;
    }

    public getCriancaId(): string {
        return this.prop.crianca_id;
    }

    public getPromptPai(): string {
        return this.prop.prompt_pai;
    }

   
    public getPaginas(): PaginaHistoria[] {
        return this.prop.paginas;
    }

    public getCriadoEm(): Date {
        return this.prop.criado_em;
    }
}