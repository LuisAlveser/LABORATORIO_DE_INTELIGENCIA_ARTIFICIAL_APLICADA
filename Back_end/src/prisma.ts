import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client"; // Ajuste o caminho se necessário
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Cria o adaptador passando a URL de conexão do seu .env
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

// 2. Instancia o PrismaClient injetando o adaptador
export const prisma = new PrismaClient({ adapter });


