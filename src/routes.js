import { Router } from 'express';
// import User from './app/models/Users';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);

routes.put('/recipientes', RecipientController.update);

/* routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Igor Dutra',
        email: 'igor@gmail.com',
        password_hash: '123456',
    });

    return res.json(user);
}); */

export default routes;
