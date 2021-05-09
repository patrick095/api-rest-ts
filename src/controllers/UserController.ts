import { Request, Response } from "express";
import {createConnection} from "typeorm";
import { Users } from '../database/entity/Users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Mail from '../services/mail';
import ORMConfig from "../config/ORMConfig";

dotenv.config();

interface IUserSignIn {
    userName: string;
    password: string;
}

interface INewUser {
    name: string,
    userName: string,
    email: string,
    password: string
}
interface IActivationUser {
    token: string,
    userName: string
}

function generateToken(params = {}){
    return jwt.sign(params, process.env.SECRET, { expiresIn: 85999 });
}

export default {
        async signIn(req: Request, res: Response){
            const { userName, password }:IUserSignIn = req.body;
            const connection = await createConnection(ORMConfig);
            let usersRepository = connection.getRepository(Users);
            const user = await usersRepository.findOne({ userName: userName });
            connection.close();
            if (!user) {
                return res.json({ message: "usuário ou senha não encontrado."})
            }
            else if (!await bcrypt.compare(password, user.password)){
                return res.json({ message: "usuário ou senha não encontrado."})
            }
            //createdAt e updatedAt vou deixar apenas para usos internos
            user.createdAt = undefined;
            user.updatedAt = undefined;
            //deixar password como indefinido para ninguém ter acesso a informações sensíveis
            user.password = undefined;
            return res.json({
                user,
                token: generateToken({id: user.id})
            })
        },
        async signUp(req: Request, res: Response){
            const { name, userName, email, password }:INewUser = req.body;
            const connection = await createConnection(ORMConfig);
            //verificar se o email ou userName já foram cadastrados
            let usersRepository = connection.getRepository(Users);
            //verifica se o email já foi cadastrado
            const verifyEmail = await usersRepository.find({
                where: [
                    { email }
                ]
            });
            if (verifyEmail.length > 0) {
                connection.close();
                return res.json({message: "Email já cadastrado"});
            }
            const verifyUserName = await usersRepository.find({
                where: [
                    { userName }
                ]
            });
            if (verifyUserName.length > 0) {
                connection.close();
                return res.json({message: "Usuário já cadastrado"});
            }
            //caso email ou userName não estejam cadastrado, segue com o cadastro
            const salt = bcrypt.genSaltSync(13);
            const hash =  bcrypt.hashSync(password, salt);
            const User = new Users;
            User.name = name;
            User.userName = userName;
            User.email = email;
            User.password = hash;
            User.createdAt = new Date();
            User.updatedAt = new Date();
            User.token = bcrypt.hashSync(email, salt);
            await connection.manager.save(User);
            connection.close();
            console.log("registered sucessfully with id: " + User.id);
            User.password = undefined;

            const mail = await Mail.SendMail({
                to: User.email,
                subject: "Ative sua conta",
                message: `
                <h1>Conta criada com sucesso!</h1>
                <h2>Para ativar sua conta clique no link abaixo</h2>
                <a href="localhost:3000/activation?token=${User.token}&userName=${User.userName}" >localhost:3000/activation?token=${User.token}&userName=${User.userName}</a>
                `
            });
            return res.json({
                User,
                token: generateToken({id: User.id})
            });
        },
        async activateAccount(req: Request, res: Response){
            const token: string = req.query.token as string;
            const userName: string = req.query.userName as string;
            
            const connection = await createConnection(ORMConfig);
            let usersRepository = connection.getRepository(Users);
            const user = await usersRepository.findOne({ userName: userName });
            if (!user) {
                connection.close();
                return res.json({message: "Erro ao ativar usuário"});
            }
            else if (!await bcrypt.compare(token, user.email)) {
                user.verified = true;
                user.token = '';
                await usersRepository.save(user);
                connection.close();
                return res.send('Usuário ativado com sucesso!');
            };
            connection.close();
            return res.json({message: "Erro ao ativar usuário"});
        }
}
