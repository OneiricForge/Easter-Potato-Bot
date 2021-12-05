import mysql from 'mysql';

import { Bot, Logger } from './utils/class';
import { database, owners } from './utils/config.json';

require("dotenv").config()

export const client = new Bot(
	{
		devs: owners,
		inDev: true,
	},
	{
		intents: [
			'GUILDS',
			'GUILD_MESSAGES',
			'GUILD_MEMBERS'
		],
		restTimeOffset: 50,
	}
);


let db = mysql.createConnection({
    database: database.database,
    host: database.host,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
})

db.connect()

export const query = (query: any, fonction?: Function) => {
    return db.query(query, fonction)
}

process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
