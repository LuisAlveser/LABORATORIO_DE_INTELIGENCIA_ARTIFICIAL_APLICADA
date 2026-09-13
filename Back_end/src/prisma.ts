import { PrismaClient } from './generated/prisma/client';
import 'dotenv/config';
const prisma = new PrismaClient();
async function testConnection() {
  try {
    // Tenta conectar ao MongoDB
    await prisma.$connect();
    console.log("🟢 Conexão com o MongoDB estabelecida com sucesso!");
    
    // Faz uma busca simples para garantir que a autenticação está 100% correta
    const testCount = await prisma.responsavel.count();
    console.log(`📊 Banco respondendo corretamente! Total de responsáveis: ${testCount}`);
  } catch (error) {
    console.error("🔴 Erro ao conectar ao MongoDB:");
    console.error(error);
    process.exit(1); // Fecha o servidor se não conectar ao banco
  }
}

// Executa o teste imediatamente ao iniciar o arquivo
testConnection();
export { prisma };
