import dotenv from 'dotenv';

dotenv.config();
interface IConfig {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        password: string
    }
}
const Config = {
    host: process.env.MAIL_HOST,
    port : 587,
    secure: false,
    auth: {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
}

export default Config;