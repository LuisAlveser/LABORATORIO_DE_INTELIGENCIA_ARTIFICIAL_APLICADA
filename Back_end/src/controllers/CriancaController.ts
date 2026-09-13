import { Request, Response } from 'express';
import { string, ZodError } from 'zod';
import { criarCriancaSchema,atualizarCriancaSchema, itemListaSchema } from '../schema/zod';
import { prisma } from '../prisma';

 export class CriancaController{
    public static async cadastrarCrianca(req:Request,res:Response){
        try {
        const body=req.body
        const id_resposavel=req.user.id

            if(!id_resposavel){
                return res.status(400).json({ mensagem:"Responsável não encontrado"});
            }
            const validador=criarCriancaSchema.parse(body)

           const novaCrianca= await prisma.crianca.create({data:{
                nome:validador.nome,
                numero_pagina:validador.numero_pagina,
                idade:validador.idade,
                responsavel_id:id_resposavel
            }})
            return res.status(201).json({novaCrianca});
        } catch (error) {
            if (error instanceof ZodError) {
                   
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  } 
               return res.status(500).json({mensagem:"Erro no servidor"})    
        }
    }

    public static async atualizarCrianca(req:Request,res:Response){
        try {
        const body=req.body
        const id=  req.params.id as string
        const id_resposavel=req.user.id

            if(!id){
                return res.status(400).json({ mensagem:"Criança não encontrada"});
            }
            const validador= atualizarCriancaSchema.parse(body)
         
            const criancaExistente = await prisma.crianca.findFirst({
        where: {
          id: id,
          responsavel_id: id_resposavel
        }
      });

      if (!criancaExistente) {
        return res.status(404).json({ mensagem: 'Criança não encontrada ou não pertence a este responsável.' });
      }
           const criancaAtualizada= await prisma.crianca.update({data:{
                nome:validador.nome,
                idade:validador.idade,
               
            },where:{id:criancaExistente.id}})

           return res.status(200).json({
        mensagem: 'Perfil da criança atualizado com sucesso.',
        crianca: criancaAtualizada
      });
        } catch (error) {
            if (error instanceof ZodError) {
                   
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  } 
               return res.status(500).json({mensagem:"Erro no servidor"})    
        }
    }

    public  static async excluirCrianca(req:Request,res:Response){
        try {
       
        const id=  req.params.id as string
        const id_resposavel=req.user.id

            if(!id){
                return res.status(400).json({ mensagem:"Criança não encontrada"});
            }
           
            const criancaExistente = await prisma.crianca.findFirst({
        where: {
          id: id,
          responsavel_id: id_resposavel
        }
      });

      if (!criancaExistente) {
        return res.status(404).json({ mensagem: 'Criança não encontrada ou não pertence a este responsável.' });
      }
           await prisma.crianca.delete({where:{id:criancaExistente.id}})

           return res.status(200).json({
        mensagem: 'Perfil da criança excluido com sucesso.',
       
      });
        } catch (error) {
            if (error instanceof ZodError) {
                   
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  } 
               return res.status(500).json({mensagem:"Erro no servidor"})    
        }
    }

     public static async listarCrianca(req:Request,res:Response){
        try {
       
       
        const id_resposavel=req.user.id

            
           
            const criancaExistente = await prisma.crianca.findFirst({
        where: {
          responsavel_id: id_resposavel
        }
      });

      if (!criancaExistente) {
        return res.status(404).json({ mensagem: 'Nenhuma criança cadastrada' });
      }
           const listacrianca= await prisma.crianca.findMany({where:{responsavel_id:id_resposavel}})

           return res.status(200).json({listacrianca});
        } catch (error) {
            if (error instanceof ZodError) {
                   
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  } 
               return res.status(500).json({mensagem:"Erro no servidor"})    
        }
    }
    
    public static async adicionarTemafavorito(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const id_responsavel = req.user.id;

     
      const { itens } = itemListaSchema.parse(req.body);

      
      const crianca = await prisma.crianca.findFirst({
        where: { id, responsavel_id: id_responsavel }
      });

      if (!crianca) {
        return res.status(404).json({ mensagem: 'Criança não encontrada ou não pertence a este responsável.' });
      }

    
      const temasAtualizados = Array.from(new Set([...crianca.temas_favoritos, ...itens]));

      const criancaAtualizada = await prisma.crianca.update({
        where: { id: crianca.id },
        data: { temas_favoritos: temasAtualizados }
      });

      return res.status(200).json({
        mensagem: 'Tema(s) adicionado(s) aos favoritos com sucesso.',
        temas_favoritos: criancaAtualizada.temas_favoritos
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ mensagem: error.issues[0].message });
      }
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
  }

 
  public static async adicionarTemaParaEvitar(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const id_responsavel = req.user.id;

      const { itens } = itemListaSchema.parse(req.body);

      const crianca = await prisma.crianca.findFirst({
        where: { id, responsavel_id: id_responsavel }
      });

      if (!crianca) {
        return res.status(404).json({ mensagem: 'Criança não encontrada ou não pertence a este responsável.' });
      }

      const temasEvitarAtualizados = Array.from(new Set([...crianca.temas_evitar, ...itens]));

      const criancaAtualizada = await prisma.crianca.update({
        where: { id: crianca.id },
        data: { temas_evitar: temasEvitarAtualizados }
      });

      return res.status(200).json({
        mensagem: 'Tema(s) adicionado(s) à lista de aversões.',
        temas_evitar: criancaAtualizada.temas_evitar
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ mensagem: error.issues[0].message });
      }
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
  }

  
  public static async adicionarPersonagem(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const id_responsavel = req.user.id;

      const { itens } = itemListaSchema.parse(req.body);

      const crianca = await prisma.crianca.findFirst({
        where: { id, responsavel_id: id_responsavel }
      });

      if (!crianca) {
        return res.status(404).json({ mensagem: 'Criança não encontrada ou não pertence a este responsável.' });
      }

      const personagensAtualizados = Array.from(new Set([...crianca.personagens_favoritos, ...itens]));

      const criancaAtualizada = await prisma.crianca.update({
        where: { id: crianca.id },
        data: { personagens_favoritos: personagensAtualizados }
      });

      return res.status(200).json({
        mensagem: 'Personagem(ns) adicionado(s) aos favoritos.',
        personagens_favoritos: criancaAtualizada.personagens_favoritos
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ mensagem: error.issues[0].message });
      }
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
  }
}