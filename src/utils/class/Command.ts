import { ApplicationCommandData, CommandInteraction, PermissionResolvable } from 'discord.js';

import { Bot } from './Bot';

type DefaultCommandRunFunction = (client: Bot, interaction: CommandInteraction) => Promise<void> | void;

interface Permission {
	bot?: PermissionResolvable;
	user?: {
		perms?: PermissionResolvable;
		dev?: boolean;
		mod?: boolean;
	};
}

export class Command {
	data: ApplicationCommandData;

	run: DefaultCommandRunFunction;

	permission?: Permission;

	constructor(data: ApplicationCommandData, run: DefaultCommandRunFunction = () => {}, permissions?: Permission) {
		this.data = data;
		this.run = run;
		this.permission = permissions;
	}
}

export class SubCommand {
	run: DefaultCommandRunFunction;

	permission?: Permission;

	constructor(run: DefaultCommandRunFunction = () => {}, permissions?: Permission) {
		this.run = run;
		this.permission = permissions;
	}
}
