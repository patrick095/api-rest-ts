import { Users } from "../database/entity/Users";

interface IORMConfig {
   type: "postgres",
   host: string,
   port: number,
   username: string,
   password: string,
   database: string,
   synchronize: boolean,
   logging: boolean,
   entities: any[],
   migrations: string[],
   subscribers: string[],
   cli: any
};

const ORMConfig: IORMConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "api-rest-ts",
    synchronize: true,
    logging: false,
    entities: [
       Users
    ],
    migrations: [
       "src/database/migration/**/*.ts"
    ],
    subscribers: [
       "src/database/subscriber/**/*.ts"
    ],
    cli: {
       "entitiesDir": "src/database/entity",
       "migrationsDir": "src/database/migration",
       "subscribersDir": "src/database/subscriber"
    }
}
export default ORMConfig;