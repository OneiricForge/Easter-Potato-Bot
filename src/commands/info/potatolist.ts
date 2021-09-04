import {CommandInteraction, MessageEmbed} from 'discord.js';
import { MysqlError } from 'mysql';
import { query } from '../..';
import {Command, Bot} from '../../utils/class/index';

export default new Command(
	{
		name: 'potatolist',
		description: 'Give you the list of all the potatoes registred',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		query(`SELECT * FROM roles`, (err: MysqlError, roles: {id:string, description: string, link: string}[]) => {
            const embed = new MessageEmbed({
                title: `List of all available potatoes | 🥔`,
                description: `To win potatoes, send proof that you have collected it in <#754451096033820712>`,
                color: '#f1c40f'
            })
            for (const r of roles) {
                embed.fields.push({
                    name: `• ${interaction.guild?.roles.cache.get(r.id)?.name}`,
                    value: r.link !== "none" ? `[${r.description}](${r.link})` : r.description,
                    inline: true
                })
            }
            interaction.reply({embeds: [embed]})
        })
	}
);
