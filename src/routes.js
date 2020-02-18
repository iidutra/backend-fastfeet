import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import User from './app/models/Users';

import DeliveryManController from './app/controllers/DeliveryManController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import authMiddleware from './app/middlewares/auth';
import ScheduleController from './app/controllers/ScheduleController';
import DeliveredController from './app/controllers/DeliveredController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

const routes = new Router();
const upload = multer(multerConfig);

// Sessao
routes.post('/sessions', SessionController.store);

// Retirada
routes.get('deliverymans/:deliveryManId/deliveries', ScheduleController.index);
routes.put(
    'deliverymans/:deliveryManId/deliveries/:deliveryId',
    ScheduleController.update
);

// Entregada
routes.put(
    '/deliverymans/:deliveryManId/deliveried/:deliveryId',
    DeliveredController.update
);
routes.get(
    '/deliverymans/:deliveryManId/deliveried',
    DeliveredController.index
);

// problemas
routes.post(
    '/deliveries/:deliveryId/problems',
    DeliveryProblemController.store
);

// proteção JWT
routes.use(authMiddleware);

// Rotas com proteçãp JWT

// Destinatarios
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:recipientId', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);
routes.delete('/recipients/:recipientId', RecipientController.delete);

// upload de fotos
routes.post('/files', upload.single('file'), FileController.store);

// Entregadores

routes.get('/deliverymans', DeliveryManController.index);
routes.get('/deliverymans/:deliverymanId', DeliveryManController.show);
routes.post('/deliverymans', DeliveryManController.store);
routes.put('/deliverymans/:deliverymanId', DeliveryManController.update);
routes.delete('/deliverymans/:deliverymanId', DeliveryManController.delete);

// Entrega
routes.get('/deliveries/:deliveryId', DeliveryController.show);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:deliveryId', DeliveryController.update);
routes.delete('/deliveries/:deliveryId', DeliveryController.delete);

// Ver Problemas
routes.get('/problems', DeliveryProblemController.index);
routes.get('/problems/:deliveryId', DeliveryProblemController.show);
routes.delete('/problems/:problemId', DeliveryProblemController.delete);

export default routes;
