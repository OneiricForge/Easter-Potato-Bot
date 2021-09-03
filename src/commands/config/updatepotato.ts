import { Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getRole } from '../../functions/get';


export default new Command(
	{
		name: 'updatepotato',
		description: "Update a potato",
        userPermissions: ["MANAGE_ROLES"],
        tags: ["guildOnly"],
        clientPermissions: ["MANAGE_ROLES"],
        aliases: ["up", "editpotato", "ep"],
        usage: "updatepotato <\"name\"/\"link\"/\"desc\"/\"tag\"> <tag> <value>"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send("no")
        const result = getRole(ctx.message, ctx.args[0])
        if (!result) return ctx.send("no")
		query(`SELECT * FROM roles WHERE id = "${result.id}"`, (err: MysqlError, res: {id:string, tag: string, description: string, link: string}[]) => {
            if (!res.length) return ctx.send(`:x: - Vous devez donner une patate existante (via son role/son nom)`)
            if (!ctx.args[1] || !['name','link','desc','tag'].includes(ctx.args[1].toLowerCase())) return ctx.send(':x: - Veuillez indiquer ce que vous voulez modifier (`link`/`desc`/`name`/`tag`)')
            if (ctx.args[1].toLowerCase() === "name") {
                result.setName(ctx.args.slice(2).join(' '))
            } else {
                if (ctx.args[1].toLowerCase() === "link") {
                    if ((!ctx.args[2].includes('http') && ctx.args[2].toLowerCase() !== 'none')) return ctx.send(':x: - Veuillez indiquer le lien où on peut trouver cette patate (le lien de la map) ou indiquer `none`')
                    query(`UPDATE roles SET link = "${ctx.args[2]}" WHERE id = "${result.id}"`)
                } else if (ctx.args[1].toLowerCase() === "desc") {
                    if (!ctx.args[2]) return ctx.send(":x: - Veuillez indiquer la nouvelle description")
                    query(`UPDATE roles SET description = "${ctx.args.slice(2).join(" ")}" WHERE id = "${result.id}"`)
                } else if (ctx.args[1].toLowerCase() === "tag") {
                    if (!ctx.args[2]) return ctx.send(":x: - Veuillez indiquer le nouveau tag")
                    query(`UPDATE roles SET tag = "${ctx.args[2]}" WHERE id = "${result.id}"`)
                }
            }
            ctx.send(`:white_check_mark: - Patate modifié`)
        })
	}
);