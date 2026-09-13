import { Router } from 'express';
import { CriancaController } from '../controllers/CriancaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const criancaRota = Router();

criancaRota.use(authMiddleware);

criancaRota.post('/crianca/', authMiddleware,CriancaController.cadastrarCrianca);
criancaRota.get('/crianca/', authMiddleware,CriancaController.listarCrianca);
criancaRota.put('/crianca/:id',authMiddleware, CriancaController.atualizarCrianca);
criancaRota.put('/crianca/:id/temaparaEvitar',authMiddleware, CriancaController.adicionarTemaParaEvitar);
criancaRota.put('/crianca/:id/adicionarTema',authMiddleware, CriancaController.adicionarTemafavorito);
criancaRota.put('/crianca/:id/adicionarPersonagem',authMiddleware, CriancaController.adicionarPersonagem);
criancaRota.delete('/crianca/:id',authMiddleware, CriancaController.excluirCrianca);

export { criancaRota};