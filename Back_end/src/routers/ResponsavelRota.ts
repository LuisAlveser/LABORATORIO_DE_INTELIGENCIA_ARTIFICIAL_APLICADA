import { Router } from 'express';
import { ResponsavelController } from '../controllers/ResponsavelController';
import { authMiddleware } from '../middlewares/authMiddleware';

const responsavelRota = Router();


 responsavelRota .post('/responsavel/cadastro', ResponsavelController.cadastro);
 responsavelRota .post('/responsavel/login', ResponsavelController.login);


 responsavelRota .put('/responsavel/perfil', authMiddleware, ResponsavelController.alterarSenha);
 responsavelRota .patch('/responsavel/alterar-senha', authMiddleware, ResponsavelController.alterarSenha);
 responsavelRota .delete('/responsavel/conta', authMiddleware, ResponsavelController.deletarConta);

export { responsavelRota };