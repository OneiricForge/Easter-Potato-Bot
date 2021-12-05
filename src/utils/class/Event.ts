import { Awaited, ClientEvents } from 'discord.js';
import {Bot} from './Bot';


export class Event <K extends keyof ClientEvents>{
	name: K;

	run: (client: Bot, ...args: ClientEvents[K]) => Awaited<void>
	
	constructor(name: K, run: (client: Bot, ...args: ClientEvents[K]) => Awaited<void>) {
		this.name = name;
		this.run = run;
	}
}