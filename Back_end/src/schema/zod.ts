
import { z } from 'zod';
export const cadastroSchemaResponsavel = z.object({

  nome: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().trim().email('Forneça um endereço de e-mail válido.'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.')

});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Forneça um e-mail válido.'),
  senha: z.string().min(1, 'A senha é obrigatória.')
});

export const atualizarPerfilSchema = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.').optional(),
  email: z.string().trim().toLowerCase().email('E-mail inválido.').optional()
});

export const alterarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Informe a senha atual.'),
  novaSenha: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.')
});

export const criarCriancaSchema = z.object({
  nome: z.string().min(3, "Nome muito curto").trim(),

  idade: z.string()
    .max(18, 'O aplicativo é voltado para crianças e adolescentes até 18 anos.'),

  numero_pagina: z.number().default(5),
});

export const atualizarCriancaSchema = z.object({
  nome: z.string().min(3, "Nome muito curto").trim(),
  idade: z.string().max(18, 'O aplicativo é voltado para crianças e adolescentes até 18 anos.'),


});
export const itemListaSchema = z.object({

  itens: z.array(z.string().trim().min(1)).or(z.string().trim().min(1).transform(val => [val]))
});

export const promptPai = z.object({
  crianca_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID da criança inválido (deve ser um ObjectId válido).'),
  prompt_pai: z.string().trim()
    .min(5, 'A instrução da história deve ter pelo menos 5 caracteres.')
    .max(500, 'A instrução da história não pode passar de 500 caracteres.')
})
export const historiaTextoSchema = z.object({
  temas_identificados: z.array(z.string()).min(2).max(4),
  personagens: z.array(z.string()).min(1),
  paginas: z.array(z.string()).min(1)
});

export const paginaHistoriaSchema = z.object({
  numero: z
    .number()
    .int()
    .positive(),
  texto: z
    .string()
    .min(1, 'O texto da página não pode estar vazio.'),
  imagem_url: z
    .string()
    .nullable()
    .optional()
});


export const historiaExibicaoSchema = z.object({
  crianca_id: z
    .string()
    .min(1, 'ID da criança inválido.'),
  prompt_pai: z
    .string()
    .min(3, 'O prompt deve ter no mínimo 3 caracteres.'),
  temas_identificados: z
    .array(z.string())
    .min(1, 'Informe pelo menos um tema identificado.'),
  paginas: z
    .array(paginaHistoriaSchema)
    .min(1, 'A história precisa ter pelo menos uma página.')
});