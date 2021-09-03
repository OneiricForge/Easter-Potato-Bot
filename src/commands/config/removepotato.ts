import { Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';


export default new Command(
	{
		name: 'removepotato',
		description: "Delete a potato",
        userPermissions: ["MANAGE_ROLES"],
		clientPermissions: ["MANAGE_ROLES"],
        tags: ["guildOnly"],
		aliases: ["rp", "oldpotato", 'op'],
		usage: "removepotato <role>"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		query(`SELECT * FROM roles WHERE tag = "${ctx.args[0]}"`, (err: MysqlError, res: {id:string, tag: string, description: string, link: string}[]) => {
            if (!res.length) return ctx.send(`:x: - Vous devez donner le tag de la patate que vous voulez donnez. Obtenable via \`potatolist\``)
            ctx.guild?.roles.cache.get(res[0].id)?.delete()
            query(`DELETE FROM roles WHERE tag ="${ctx.args[0]}"`)
            ctx.send(`:white_check_mark: - La patate avec le tag ${ctx.args[0]} a bien été supprimé !`)
        })
	}
);