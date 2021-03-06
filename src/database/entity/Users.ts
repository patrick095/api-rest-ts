import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    verified: boolean = false;

    @Column()
    token: string = '';

    @Column({type: 'date'})
    createdAt: Date;

    @Column({type: 'date'})
    updatedAt: Date;

}
