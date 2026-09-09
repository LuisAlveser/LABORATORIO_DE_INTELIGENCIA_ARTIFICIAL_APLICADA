import { Crianca } from "./Crianca";

export interface PropResponsavel {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    crianca?: Crianca[];
}

export class Responsavel {
    constructor(private readonly prop: PropResponsavel) {}

    public getId(): string | undefined {
        return this.prop.id;
    }

    public getNome(): string {
        return this.prop.nome;
    }

    public getEmail(): string {
        return this.prop.email;
    }

    public getSenha(): string {
        return this.prop.senha;
    }

    public getCrianca(): Crianca[] | undefined {
        return this.prop.crianca;
    }
}
