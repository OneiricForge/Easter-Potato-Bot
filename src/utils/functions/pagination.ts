import {CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';

export const pagination = async (
	i: CommandInteraction,
	tab: string[] | string[][],
	title: string,
	page: number = 0,
	type: 'description' | 'field' = 'description',
	inline: boolean = type === 'description' ? false : true
) => {
	const maxPages = Math.floor(tab.length / 10.0000000001);

	const buttons = new MessageActionRow({
		components: [
			new MessageButton({
				customId: '⬅️',
				emoji: '⬅️',
				style: 'SECONDARY',
			}),
			new MessageButton({
				customId: '❌',
				emoji: '❌',
				style: 'SECONDARY',
			}),
			new MessageButton({
				customId: '➡️',
				emoji: '➡️',
				style: 'SECONDARY',
			}),
		],
	});
	let baseEmbed = new MessageEmbed({
		title: title,
		color: '#f1c40f',
		footer: {text: `(${page + 1}/${maxPages + 1})`},
	});

	let text = tab.slice(page * 10, (page + 1) * 10);
	if (type === 'description') {
		baseEmbed.description = text.join(`\n`);
	} else {
		for (const t of text) {
			baseEmbed.fields.push({
				name: t[0],
				value: t[1],
				inline: inline,
			});
		}
	}
	await i.reply({embeds: [baseEmbed], components: [buttons]});
	const m = (await i.fetchReply()) as Message;
	m.edit({embeds: [baseEmbed], components: [buttons]})
	const data_res = m.createMessageComponentCollector({time: 120000, componentType: 'BUTTON'});
	data_res.on('collect', async it => {
		if (it.user.id !== i.user.id) {
			return it.reply({content: `This panel is not for you`, ephemeral: true})
		}
		if (it.customId === '❌') {
			it.deferUpdate()
			return data_res.stop();
		}
		if (it.customId === '⬅️' && page !== 0) page--;
		if (it.customId === '➡️' && page < maxPages) page++;
		baseEmbed.footer = {text: `(${page + 1}/${maxPages + 1})`};
		let text = tab.slice(page * 10, (page + 1) * 10);
		if (type === 'description') {
			baseEmbed.description = text.join(`\n`);
		} else {
			for (const t of text) {
				baseEmbed.fields = [];
				baseEmbed.fields.push({
					name: t[0],
					value: t[1],
					inline: inline,
				});
			}
		}
		it.deferUpdate()
		m.edit({embeds: [baseEmbed], components: [buttons]})
	});
	data_res.on('end', async (_ , r) => {
		m.edit({embeds: [baseEmbed], components: []})
	})
};
