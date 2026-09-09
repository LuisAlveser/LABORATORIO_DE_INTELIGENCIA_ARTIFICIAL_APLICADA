

export interface PropCrianca{
    id?: string;
    responsavel_id?: string;
    nome: string;
    idade: number;
    numero_pagina:number;
    temas_favoritos?: string[];
    temas_evitar?: string[];
    personagens_favoritos?: string[]; 

    


}

 export class Crianca{
    constructor( private readonly prop:PropCrianca ){}
      public getId(): string | undefined {
        return this.prop.id;
    }

    public getResponsavelId(): string | undefined {
        return this.prop.responsavel_id;
    }

    public getNome(): string {
        return this.prop.nome;
    }

    public getIdade(): number {
        return this.prop.idade;
    }

    public getNumeroPagina(): number {
        return this.prop.numero_pagina;
    }

    public getTemasFavoritos(): string[] | undefined {
        return this.prop.temas_favoritos;
    }

    public getTemasEvitar(): string[] | undefined {
        return this.prop.temas_evitar;
    }

    public getPersonagensFavoritos(): string[] | undefined {
        return this.prop.personagens_favoritos;
    }
   
}