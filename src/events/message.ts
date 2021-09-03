import {Message, MessageAttachment, MessageEmbed, TextChannel} from 'discord.js';
import {Event, CommandHandler, getThing, permissionsError, Tag, Logger, argError, codeError} from 'advanced-command-handler'
import { Context } from "../class/Context"

export default new Event(
	{
		name: 'message',
	},
	async (handler: typeof CommandHandler, message: Message): Promise<any> => {
		if (message.author.bot || message.system) return;


		if (message.content.replace('!',"") === "<@" + handler.client?.user?.id + ">") message.channel.send("My prefix is `" + handler.prefixes[0] +"` 🥔")

		if (message.channel.id === "754451096033820712") {
			if (!message.attachments) {
				message.delete()
				return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!')
			}
			if (message.attachments.array().length != 1) {
				message.delete()
				return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!')
			}
			if (!message.attachments.array()[0].name?.endsWith('.png') && message.attachments.array()[0].name?.endsWith('.jpg') && !message.attachments.array()[0].name?.endsWith('.jpeg') && !message.attachments.array()[0].name?.endsWith('.gif')) {
				message.delete()
				return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!')
			}
			if (!message.guild) return
			let x = message.attachments.array()[0].name?.split('.')?? []
			const attachment = new MessageAttachment(message.attachments.array()[0].url, message.guild.id+'.'+x[x.length - 1])
			let embed = new MessageEmbed()
			.setTitle('Proposition par '+message.author.username)
			.attachFiles([attachment])
			.setImage('attachment://'+message.guild.id+'.'+x[x.length - 1])
			.setFooter(message.author.id)
			.setDescription('Pour donner le rôle lié faites "accept <patate id>"')
			if (message.content.length) embed.description += `\n**Message :**\n${message.content}`
			const channel = (message.guild.channels.cache.get("829741063941521488") as TextChannel)
			console.log(channel)
			channel.send(embed)
			message.delete()
		}

		if (message.channel.id === "867343862728228895") {
			await message.react(`✅`)
			await message.react(`❌`)
		}

		const prefix = CommandHandler.getPrefixFromMessage(message);
		if (!prefix) return;

		const [commandArg, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', commandArg.toLowerCase().normalize());

		if (command) {
			if (command.isInCooldown(message) && message.author.id !== "563749920683720709") return message.channel.send(`You are on a cooldown! Please wait **${command.getCooldown(message).waitMore / 1000}**s.`);

			if (!command.isInRightChannel(message) && message.author.id !== "563749920683720709") return message.channel.send(`This command is not in the correct channel.`);

			const missingPermissions = command.getMissingPermissions(message);
			const missingTags = command.getMissingTags(message);

			if (missingPermissions.client.length) return permissionsError(message, missingPermissions.client, command, true);
			if (missingPermissions.user.length && message.author.id !== "563749920683720709") return permissionsError(message, missingPermissions.user, command);

			if (missingTags.length)
				return argError(
					message,
					`There are missing tags for the message: \n\`${missingTags
						.map(tag => Tag[tag])
						.sort()
						.join('\n')
						.toUpperCase()}\``,
					command
				);
			if (message.guild && !message.guild?.me?.hasPermission('EMBED_LINKS')) return message.channel.send(`I need the EMBED LINK permission for a lot of commands`).then((m: Message) => {
				setTimeout(() => m.delete(), 5000)
			})
			try {
                let ctx = new Context(handler, message, prefix, args, command)
				await command.run(handler, ctx);
				command.setCooldown(message);
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			} catch (error: any) {
				await codeError(message, error, command);
			}
		}
	}
);