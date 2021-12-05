import { CommandInteraction } from 'discord.js';

import { Bot, Command } from '../../utils/class';

export default new Command(
	{
		name: 'ping',
		description: 'Get the bot latency',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		const api = interaction.guild?.shard.ping;
		const bot = Date.now() - interaction.createdTimestamp;

		interaction.reply(`Pong ! 🤖 ${bot}ms | <:djsguide:883437283120930848> ${api}ms`);
	}
);
