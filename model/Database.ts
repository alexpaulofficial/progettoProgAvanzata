require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';


export class SequelizeSingleton {
	
    private static instance: SequelizeSingleton;
	private connection: Sequelize;

    private constructor() {
		this.connection = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            dialect: 'postgres'
        });
	}

	public static getConnection(): Sequelize {
        if (!SequelizeSingleton.instance) {
            this.instance = new SequelizeSingleton();
        }
        return SequelizeSingleton.instance.connection;
    }
}