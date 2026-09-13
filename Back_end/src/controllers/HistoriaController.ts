import{Request,Response} from "express"
import { historiaExibicaoSchema, historiaTextoSchema, promptPai } from "../schema/zod"
import { ZodError } from "zod";
import { prisma } from "../prisma";
import { GoogleGenAI } from '@google/genai';
import { HitoriaExibicao } from "../models/Historia";
import { PaginaHistoria } from "../models/Historia";

 export class HistoriaController{
 
 
    static async gerarHistoria(req:Request,res:Response){
         try {
           const body=req.body
           const validador=promptPai.parse(body)
           const crianca=await prisma.crianca.findFirst({where:{id:validador.crianca_id}})
           if(!crianca){
              return res.status(400).json({mensagem:"Criança não encontrada"});
           }

           const prompt=`Você é um especialista em literatura infantil para crianças no espectro autista
           gere uma história de ${crianca.numero_pagina} páginas  para uma criança de nome ${crianca.nome}
          e que tem ${crianca.idade}
           anos de idade sobre: ${validador.prompt_pai}'. Retorne a resposta EXCLUSIVAMENTE 
           em formato JSON com a seguinte estrutura: 
           { 
           "temas_identificados": ["array de 2 a 4 palavras-chave simples que definem o tema,
            cenários ou elementos da história"], 
            "paginas": ["Texto da página 1", "Texto da página 2", "Texto da página 3"] 
            e  "personagens": ["Nome do personagem 1", "Nome do personagem 2","Nome do personagem 3"] }"
` 
           const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });   
    
       
     const resposta= await ai.models.generateContent({
       model: "gemini-2.5-flash",
     contents: prompt,
     config: {
      responseMimeType: 'application/json',
      temperature: 0.7
    }
})
   const textoGerado = resposta.text;
   if (!textoGerado) {
    throw new Error('O Gemini não retornou nenhum conteúdo.');
  }
   const jsonObjeto = JSON.parse(textoGerado);
   const historiaTexto=historiaTextoSchema.parse(jsonObjeto)
   const imagens= await this.gerarImagens(historiaTexto.paginas)
         const historiapagina: PaginaHistoria[] = historiaTexto.paginas.map((textoPagina, index) => ({
  numero: index + 1,        
  texto: textoPagina,         
  imagem_url: imagens[index]??""  
}));
       const historia:HitoriaExibicao ={
           crianca_id: validador.crianca_id,
           prompt_pai: validador.prompt_pai,
           temas_identificados: historiaTexto.temas_identificados,
           paginas:historiapagina
       }
      
       
          return res.status(200).json({
             historia
          })

         } catch (error) {
               if (error instanceof ZodError) {
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  }
           return  res.status(500).json("Erro no servidor")
         }
 }
 static async gerarImagens(paginas: string[]): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });
    const imagensBase64: string[] = [];

    for (let i = 0; i < paginas.length; i++) {
      const promptVisual =`
      Ilustração infantil estilo livro de histórias, visual simples,
       colorido e acolhedor sobre: ${paginas[i]}`;

      
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: promptVisual,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1', 
        },
      });

      const base64Data = response.generatedImages?.[0]?.image?.imageBytes;

      if (!base64Data) {
        throw new Error(`Falha ao gerar imagem para a página ${i + 1}`);
      }

      
      imagensBase64.push(`data:image/png;base64,${base64Data}`);
    }

    return imagensBase64;
  }


  public static async listarHistoria(req:Request,res:Response){
    try {
        const historias=await prisma.historia.findMany()
        return res.status(200).json(historias)
    } catch (error) {
         return  res.status(500).json("Erro no servidor")
    }
  }
  public static async excluirHistoria(req:Request,res:Response){
    try {
        const id=req.params.id as string
        const historias=await prisma.historia.findFirst({where:{id:id}})
        const historiaExistente = await prisma.historia.findUnique({
        where: { id }
      });

      if (!historiaExistente) {
        return res.status(404).json({ mensagem: 'História não encontrada.' });
      }

     
      await prisma.historia.delete({
        where: { id }
      });
        return res.status(200).json(historias)
    } catch (error) {
         return  res.status(500).json("Erro no servidor")
    }
  }
  static async salvarHistoria(req:Request,res:Response){
     try {

           const body=req.body
           const validador=historiaExibicaoSchema.parse(body)
        await prisma.historia.create({data:{
            crianca_id:validador.crianca_id,
            prompt_pai:validador.prompt_pai,          
            temas_identificados:validador.temas_identificados, 
             paginas:validador.paginas,             
        }})
       // desenvolver salvamento de imagem no supabase
       return  res.status(200).json("História salva com sucesso !")
         } catch (error) {
             if (error instanceof ZodError) {
                    return res.status(400).json({ mensagem:error.issues[0].message });
                  }
        return  res.status(500).json("Erro no servidor")
     }
  }
}
