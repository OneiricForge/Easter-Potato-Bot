import { BetterEmbed, Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { pagination } from '../../functions/pagination';


export default new Command(
	{
		name: 'top',
		description: "Get the top of the bot",
        tags: [Tag.guildOnly],
        aliases: ["classement", "t"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        query(`SELECT * FROM users`, (err: MysqlError, res: {id: string, potatoes: number}[]) => {
            if (!res.length) return ctx.send(`no`)
            const ranks: number[] = [];
            let res2 = res.sort((a, b) => b.potatoes - a.potatoes).filter(a => a.potatoes !== 0).map(r => {
                if (!ranks.includes(r.potatoes)) ranks.push(r.potatoes)
                return r
            })
            const result = res2.map(u => {
                const rank = (ranks.indexOf(u.potatoes) + 1)
                return `${rank}. ${ctx.guild?.members.cache.get(u.id)?.displayName} | ${u.potatoes} ${rank === 1 ? `<:1patate:829627813191221308>`: `🥔`}`
            });
            pagination(ctx, result, "Top  | 🥔", 0, 'description', false)
        })
	}
);