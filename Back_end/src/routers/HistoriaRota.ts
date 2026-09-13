import { Router } from 'express';
import {HistoriaController } from '../controllers/HistoriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const historiaRota = Router();



 historiaRota .post('/historia/', HistoriaController.gerarHistoria);
historiaRota .post('/salvarhistoria', HistoriaController.salvarHistoria);
historiaRota.get('/historia', HistoriaController.listarHistoria);
historiaRota .delete('/historia/:id', HistoriaController.excluirHistoria);

 

export { historiaRota };