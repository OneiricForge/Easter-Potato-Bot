import { CommandInteraction } from 'discord.js';

import { db } from '../..';
import { Bot, Command } from '../../utils/class';
import { pagination } from '../../utils/functions/pagination';

export default new Command(
	{
		name: 'top',
		description: 'Get the top of the bot',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		db.all(`SELECT * FROM users`, (err, res: {id: string, potatoes: number}[]) => {
            if (!res.length) return interaction.reply({content:`no`})
            const ranks: number[] = [];
            let res2 = res.sort((a, b) => b.potatoes - a.potatoes).filter(a => a.potatoes !== 0).map(r => {
                if (!ranks.includes(r.potatoes)) ranks.push(r.potatoes)
                return r
            })
            const result = res2.map(u => {
                const rank = (ranks.indexOf(u.potatoes) + 1)
                return `${rank}. ${interaction.guild?.members.cache.get(u.id)?.displayName} | ${u.potatoes} ${rank === 1 ? `<:1patate:829627813191221308>`: `🥔`}`
            });
            pagination(interaction, result, "Top  | 🥔", 0, "description")
        })
	}
);
