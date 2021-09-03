import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';


export default new Command(
	{
		name: 'potatolist',
		description: "Give you the list of all the potatoes registred",
        aliases: ["pl"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        query(`SELECT * FROM roles`, (err: MysqlError, roles: {id:string, tag: string, description: string, link: string}[]) => {
            const embed = new BetterEmbed({
                title: `List of all available potatoes | 🥔`,
                description: `To win potatoes, send proof that you have collected it in <#754451096033820712>`,
                color: '#f1c40f'
            })
            for (const r of roles) {
                embed.fields.push({
                    name: `${r.tag} • ${ctx.guild?.roles.cache.get(r.id)?.name}`,
                    value: r.link !== "none" ? `[${r.description}](${r.link})` : r.description,
                    inline: true
                })
            }
            ctx.send(embed)
        })
	}
);