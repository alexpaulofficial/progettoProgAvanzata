require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';

const POSTGRES_PORT = 5432;
export class SequelizeSingleton {
	
    private static instance: SequelizeSingleton;
	private connection: Sequelize;

    private constructor() {
		this.connection = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
            host: process.env.POSTGRES_HOST,
            port: Number(POSTGRES_PORT),
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