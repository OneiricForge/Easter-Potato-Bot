import {Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, TextChannel, User} from 'discord.js';
import {Event, Bot} from '../utils/class/index';

export default new Event('messageCreate', async (client: Bot, message: Message) => {
	if (message.author.bot || !message.guild) return
	const submit = client.inDev ? "829407595252154368" : "754451096033820712"
	const verify = client.inDev ? "829407613204299797" : "829741063941521488"
	if (message.channel.id === submit) {
		if (!message.attachments) {
			message.delete()
			return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!').catch(_ => _)
		}
		if (message.attachments.map(m => m).length != 1) {
			message.delete()
			return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!').catch(_ => _)
		}
		if (!message.attachments.map(m => m)[0].name?.endsWith('.png') && message.attachments.map(m => m)[0].name?.endsWith('.jpg') && !message.attachments.map(m => m)[0].name?.endsWith('.jpeg') && !message.attachments.map(m => m)[0].name?.endsWith('.gif')) {
			message.delete()
			return message.author.send('• :flag_fr: Ce salon n\'est pas fait pour discuter, si vous trouver une "Easter Potato" sur l\'une des maps d\'OneiricForge, postez une image le prouvant ici !\n\n• :flag_gb: This channel is not used for discussion, if you find an "Easter Potato" on one of the OneiricForge\'s maps, send a picture here!').catch(_ => _)
		}
		let extension = message.attachments.map(m => m)[0].name?.split('.')?? []
		const attachment = new MessageAttachment(message.attachments.map(m => m)[0].url, message.guild.id+'.'+extension[extension.length - 1])
		const embed = new MessageEmbed({
			title: 'Proposition par '+message.author.username,
			image: {
				url: 'attachment://'+message.guild.id+'.'+extension[extension.length - 1]
			},
			description: 'Pour donner le rôle lié utiliser les boutons ci-dessous'
		})
		if (message.content.length) embed.description += `\n**Message :**\n${message.content}`
		const buttons = new MessageActionRow({
			components: [
				new MessageButton({
					emoji: "✅",
					customId: `accept-${message.author.id}`,
					style: "SUCCESS"
				}),
				new MessageButton({
					emoji: "❌",
					customId: `refuse-${message.author.id}`,
					style: "DANGER"
				})
			]
		})
		const channel = (message.guild.channels.cache.get(verify) as TextChannel)
		channel.send({embeds:[embed], files: [attachment], components: [buttons]})
		message.delete()
	}
});
