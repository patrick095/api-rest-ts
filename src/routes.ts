import { Router } from "express";
import UserController from "./controllers/UserController";


const routes = Router();

routes.get('/', (req, res) => {
    res.json({ message: 'API-REST-TS' });
  });

routes.post('/signin', UserController.signIn);
routes.post('/signup', UserController.signUp);

export default routes;