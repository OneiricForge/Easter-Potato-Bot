import {
  Interaction,
  Message,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  SelectMenuInteraction,
} from 'discord.js';
import { MysqlError } from 'mysql';

import { query } from '..';
import { Bot, Event, Logger } from '../utils/class';

export default new Event('interactionCreate', async (client: Bot, interaction: Interaction) => {
	if (interaction.isCommand()) {
		// We handle commands

		if (!interaction.guild)
			return await interaction.reply({
				content: `Sorry but to work ${client.user?.username} need to be in your guild not only as slash commands.\nHere is my invite link : https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=-1&scope=bot%20applications.commands`,
			});

		const result = [interaction.commandName];

		const subCommandGroup = interaction.options.getSubcommandGroup(false);

		if (subCommandGroup) result.push(subCommandGroup);

		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) result.push(subCommand);

		const command = client.commands.get(result.join('/'));
		if (!command) return;

		if (command.permission) {
			if (!interaction.guild.me?.permissions.has(command.permission.bot ?? []))
				return await interaction.reply({
					content: "I can't handle this command, I need permission that are missing : `" + command.permission.bot?.toString() + '`.',
				});

			const member = interaction.guild.members.cache.get(interaction.user.id);

			if (!member?.permissions.has(command.permission.user?.perms ?? []))
				return await interaction.reply({
					content: `You can't use that command, you need permissions that are missing : \`${command.permission.user?.perms?.toString()}\`.`,
					ephemeral: true,
				});
			
			
			const forgerons = client.inDev ? '698880675066937414' : '701178173139714069'
			if (command.permission.user?.mod && !member.roles.cache.has(forgerons) && !client.developpers.includes(member.id))
				return await interaction.reply({content: `You can't use that command, you need to be a forgeron.`, ephemeral: true});

			if (command.permission.user?.dev && !client.developpers.includes(member.id))
				return await interaction.reply({content: `You can't use that command, you need to be a bot developer.`, ephemeral: true});
		}

		try {
			await command.run(client, interaction);
		} catch (error) {
			Logger.error(`An error occured while trying to exectue the command ${interaction.commandName} : ${error}`);
			await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
		}
	} else if (interaction.isButton()) {
		const verify = client.inDev ? "829407613204299797" : "829741063941521488";
		if (interaction.channel?.id === verify) {
			if (!interaction.message.components) return
			if (interaction.customId.startsWith('accept-')) {
				query(`SELECT * FROM roles`, async (err: MysqlError, res: {id:string, description: string, link: string}[]) => {
					const options: MessageSelectOptionData[] = [
					]
					for (const role of res) {
						options.push({
							label: interaction.guild?.roles.cache.get(role.id)?.name ?? "PlaceHolder",
							description: role.description,
							value: role.id
						})
					}
					const menu = new MessageActionRow({
						components: [
							new MessageSelectMenu({
								customId: `select-${interaction.message.id}`,
								placeholder: `Nothing selected`,
								options
							})
						]
					})
					await interaction.reply({content: `Wich potato ?`, components: [menu]})
					const msg = (await interaction.fetchReply() as Message)
					
					const collector = msg.createMessageComponentCollector({componentType: "SELECT_MENU", time: 60000})
					collector.on("collect", async (i: SelectMenuInteraction) => {
						if (i.user.id === interaction.user.id) {
							const user = ((interaction.message.components as MessageActionRow[])[0].components.find(e => e.type === "BUTTON" && e.customId?.startsWith('accept-'))?.customId?.replace('accept-','') as string)
							await interaction.guild?.members.cache.get(user)?.roles.add(i.values[0])
							await i.reply({content: "Done ^^", ephemeral: true});
							await (interaction.message as Message).delete()
							await msg.delete()
							collector.stop()
						} else {
							await interaction.reply({content: "NOT FOR YOU", ephemeral: true})
						}
					})
				})
			} else {
				await interaction.reply({content: "Okay I will do nothing ^^", ephemeral: true})
				await (interaction.message as Message).delete()
			}
		}
	}
});
