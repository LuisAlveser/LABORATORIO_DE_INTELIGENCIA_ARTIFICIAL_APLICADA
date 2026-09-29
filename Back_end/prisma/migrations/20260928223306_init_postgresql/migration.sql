-- CreateEnum
CREATE TYPE "TipodeAvaliação" AS ENUM ('GOSTEI', 'NAO_GOSTEI', 'OK');

-- CreateEnum
CREATE TYPE "TipoAvaliacao" AS ENUM ('GOSTEI', 'NAO_GOSTEI', 'OK');

-- CreateTable
CREATE TABLE "PaginaHistoria" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "imagem_url" TEXT,
    "historia_id" TEXT NOT NULL,

    CONSTRAINT "PaginaHistoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crianca" (
    "id" TEXT NOT NULL,
    "responsavel_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "numero_pagina" INTEGER NOT NULL DEFAULT 5,
    "temas_favoritos" TEXT[],
    "temas_evitar" TEXT[],
    "personagens_favoritos" TEXT[],

    CONSTRAINT "Crianca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoAvulsa" (
    "id" TEXT NOT NULL,
    "crianca_id" TEXT NOT NULL,
    "prompt_pai" TEXT NOT NULL,
    "temas_identificados" TEXT[],
    "avaliacao" "TipoAvaliacao" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvaliacaoAvulsa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historia" (
    "id" TEXT NOT NULL,
    "crianca_id" TEXT NOT NULL,
    "prompt_pai" TEXT NOT NULL,
    "temas_identificados" TEXT[],
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_email_key" ON "Responsavel"("email");

-- AddForeignKey
ALTER TABLE "PaginaHistoria" ADD CONSTRAINT "PaginaHistoria_historia_id_fkey" FOREIGN KEY ("historia_id") REFERENCES "Historia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crianca" ADD CONSTRAINT "Crianca_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoAvulsa" ADD CONSTRAINT "AvaliacaoAvulsa_crianca_id_fkey" FOREIGN KEY ("crianca_id") REFERENCES "Crianca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historia" ADD CONSTRAINT "Historia_crianca_id_fkey" FOREIGN KEY ("crianca_id") REFERENCES "Crianca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
