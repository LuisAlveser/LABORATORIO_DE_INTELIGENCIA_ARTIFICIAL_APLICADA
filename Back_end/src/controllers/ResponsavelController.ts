import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { alterarSenhaSchema, atualizarPerfilSchema, cadastroSchemaResponsavel, loginSchema } from '../schema/zod';
import { email, ZodError } from 'zod';
import {prisma} from "../prisma"
import jwt from "jsonwebtoken" 

export class ResponsavelController{

    static async cadastro(req:Request,res:Response){
        try {
            const body=req.body
            const validador=cadastroSchemaResponsavel.parse(body)
            const salt=10
            const senhahash= await bcrypt.hash(validador.senha,salt)
            const emailexistente=await prisma.responsavel.findFirst({where:{email:validador.email}})
            if(emailexistente){
                return res.status(400).json({mensagem:"Email já existente"})
            }
          const responsavel= await prisma.responsavel.create({data:{
            nome:validador.nome,
            email:validador.email,
            senha:senhahash
          }})
          const tokensegredo={id:responsavel.id,nome:responsavel.nome,email:validador.email}
          const token=jwt.sign(tokensegredo,process.env.TOKEN_SEGREDO!,{expiresIn:"1h"})
            return res.status(201).json({token,responsavel: {
          id: responsavel.id,
          nome: responsavel.nome,
          email: responsavel.email
        }})
        } catch (error) {
          console.error("Erro:",error)
            if(error instanceof ZodError){
                return res.status(400).json({mensagem:error.issues[0].message})
            }
            return res.status(500).json({mensagem:"Erro no servidor"})
        }
    }
    static async login(req: Request, res: Response) {
    try {
      const { email, senha } = loginSchema.parse(req.body);

     
      const responsavel = await prisma.responsavel.findFirst({
        where: { email }
      });

      if (!responsavel) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
      }

     
      const senhaCorreta = await bcrypt.compare(senha, responsavel.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
      }

     
      const tokensegredo = { id: responsavel.id, nome: responsavel.nome, email: responsavel.email };
      const token = jwt.sign(tokensegredo, process.env.TOKEN_SEGREDO!, { expiresIn: '7d' });

      return res.status(200).json({
        token,
        responsavel: {
          id: responsavel.id,
          nome: responsavel.nome,
          email: responsavel.email
        }
      });
      
    } catch (error) {
      if (error instanceof ZodError) {
       
        return res.status(400).json({ mensagem:error.issues[0].message });
      }
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
  }

  
  static async atualizarPerfil(req: Request, res: Response) {
    try {
      const responsavelId = req.user.id; 
      const dadosValidados = atualizarPerfilSchema.parse(req.body);

     
      if (dadosValidados.email) {
        const emailEmUso = await prisma.responsavel.findFirst({
          where: {
            email: dadosValidados.email,
            NOT: { id: responsavelId }
          }
        });

        if (emailEmUso) {
          return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outra conta.' });
        }
      }

    
      const responsavelAtualizado = await prisma.responsavel.update({
        where: { id: responsavelId },
        data: dadosValidados,
        select: {
          id: true,
          nome: true,
          email: true
        }
      });
       const tokensegredo = {
        id: responsavelAtualizado.id, 
        nome: responsavelAtualizado.nome, 
        email: responsavelAtualizado.email };
      const token = jwt.sign(tokensegredo, process.env.TOKEN_SEGREDO!, { expiresIn: '7d' });

      return res.status(200).json({
        token,
        mensagem: 'Perfil atualizado com sucesso.',
       
      });
    } catch (error) {
      if (error instanceof ZodError) {
        
        return res.status(400).json({ mensagem: error.issues[0].message });
      }
      return res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
    }
  }

 
  static async alterarSenha(req: Request, res: Response) {
    try {
      const responsavelId = req.user.id;
      const { senhaAtual, novaSenha } = alterarSenhaSchema.parse(req.body);

      
      const responsavel = await prisma.responsavel.findUnique({
        where: { id: responsavelId }
      });

      if (!responsavel) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      
      const senhaValida = await bcrypt.compare(senhaAtual, responsavel.senha);
      if (!senhaValida) {
        return res.status(400).json({ mensagem: 'A senha atual incorreta.' });
      }

 
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      await prisma.responsavel.update({
        where: { id: responsavelId },
        data: { senha: novaSenhaHash }
      });

      return res.status(200).json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (error) {
      if (error instanceof ZodError) {
        
        return res.status(400).json({ mensagem: error.issues[0].message });
      }
      return res.status(500).json({ mensagem: 'Erro ao alterar senha.' });
    }
  }

  
  static async deletarConta(req: Request, res: Response) {
    try {
      const responsavelId = req.user.id;

     
      await prisma.responsavel.delete({
        where: { id: responsavelId }
      });

      return res.status(200).json({ mensagem: 'Conta e dados associados excluídos com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      return res.status(500).json({ mensagem: 'Erro ao excluir conta.' });
    }
  }

}