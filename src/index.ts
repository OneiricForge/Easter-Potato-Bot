import { Database } from 'sqlite3';

import { Bot, Logger } from './utils/class';
import { owners } from './utils/config.json';

require("dotenv").config()

export const client = new Bot(
	{
		devs: owners,
		inDev: false,
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


export const db = new Database(`database.db`, err => {
      if (err) {
        Logger.error('Moderation ' + err.message);
        process.exit();
      }
    })

		db.run(`
			CREATE TABLE IF NOT EXISTS roles (
				id VARCHAR(18) PRIMARY KEY NOT NULL,
				description TEXT NOT NULL,
				link TEXT NOT NULL
			);
			`);
			db.run(`
			CREATE TABLE IF NOT EXISTS users (
				id VARCHAR(18) PRIMARY KEY NOT NULL,
				potatoes INTEGER NOT NULL
				);
			`);


process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
