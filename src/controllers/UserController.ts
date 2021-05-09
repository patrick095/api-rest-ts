import { Request, Response } from "express";
import {createConnection} from "typeorm";
import { Users } from '../database/entity/Users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

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
function generateToken(params = {}){
    return jwt.sign(params, process.env.SECRET, { expiresIn: 85999 });
}

export default {
        async signIn(req: Request, res: Response){
            const { userName, password }:IUserSignIn = req.body;
            const connection = await createConnection();
            let usersRepository = connection.getRepository(Users);
            const user = await usersRepository.findOne({ userName: userName });
            connection.close();
            if (!user) {
                return res.json({ message: "usuário ou senha não encontrado."})
            }
            else if (!await bcrypt.compare(password, user.password)){
                return res.json({ message: "usuário ou senha não encontrado."})
            }
            user.createdAt = undefined;
            user.updatedAt = undefined;
            user.password = undefined;
            return res.json({
                user,
                token: generateToken({id: user.id})
            })
        },
        async signUp(req: Request, res: Response){
            const { name, userName, email, password }:INewUser = req.body;
            const connection = await createConnection();
            const salt = bcrypt.genSaltSync(13);
            const hash =  bcrypt.hashSync(password, salt);
            const User = new Users;
            User.name = name;
            User.userName = userName;
            User.email = email;
            User.password = hash;
            User.createdAt = new Date();
            User.updatedAt = new Date();
            await connection.manager.save(User);
            console.log("registered sucessfully with id: " + User.id);
            User.password = undefined;
            res.json({
                User,
                token: generateToken({id: User.id})
            });
        }
}
