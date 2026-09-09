# 📖 Leitura Sensorial & Adaptativa com IA

> Aplicativo móvel focado em experiência de leitura sensorial, simples e adaptativa para crianças com Transtorno do Espectro Autista (TEA), gerando histórias personalizadas e ilustradas página a página através de Inteligência Artificial.

---

## 📸 Visão Geral do Projeto

O objetivo do aplicativo é proporcionar um ambiente de leitura seguro, previsível e acolhedor para crianças no espectro autista. 

Através da mediação dos pais ou responsáveis, o app captura solicitações simples de temas e as transforma em **histórias ilustradas em layout vertical**, adaptando automaticamente o vocabulário, o comprimento do texto e os temas de interesse da criança através do feedback visual por emojis.

---

## 🛠️ Tech Stack & Tecnologias

### **Mobile (Front-end)**
* **React Native** (com Expo)
* **TypeScript**
* **React Navigation** (ou Expo Router)
* **Expo SecureStore** (Armazenamento seguro de tokens JWT)

### **API & Servidor (Back-end)**
* **Node.js** com **TypeScript**
* **Express.js** (Framework HTTP)
* **Prisma ORM** (Mapeamento de dados para MongoDB)
* **OpenAI API / LLM** (Geração de histórias e prompts de imagem)

### **Banco de Dados & Storage**
* **MongoDB** (Persistência NoSQL flexível para perfis e histórias)
* **Supabase Storage** (Armazenamento de imagens e entrega via CDN)

---

## 📐 Arquitetura do Sistema (Padrão MVC)

O back-end foi estruturado utilizando o padrão **MVC (Model-View-Controller)** adaptado para APIs REST, mantendo o código pragmático, direto e de fácil manutenção:

* **View (V):** O próprio aplicativo em **React Native**, responsável por renderizar as telas com acessibilidade visual e suporte sensorial.
* **Controller (C):** Responsável pelo fluxo de requisições, regras do prompt da IA, encadeamento de geração de imagens e atualização das preferências do usuário.
* **Model (M):** Interfaces TypeScript, schemas do **Prisma ORM** e comunicação direta com o **MongoDB**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 REACT NATIVE (View Layer)                   │
│         Exibição Vertical Página por Página + Emojis         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Requisições HTTP REST (JSON + JWT)
┌──────────────────────────────▼──────────────────────────────┐
│                    NODE.JS (API REST - MVC)                 │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Controllers (Ex: HistoriaController, AuthController) │   │
│   └──────────────┬───────────────────┬──────────────────┘   │
│                  │                   │                      │
│   ┌──────────────▼─────┐      ┌──────▼──────────────┐       │
│   │ Prisma ORM (Model) │      │ Serviços Externos   │       │
│   │   (MongoDB)        │      │ OpenAI & Supabase   │       │
│   └────────────────────┘      └─────────────────────┘       │
└─────────────────────────────────────────────────────────────┘