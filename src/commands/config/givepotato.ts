import { Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getUser } from '../../functions/get';


export default new Command(
	{
		name: 'givepotato',
		description: "Give a potato",
        userPermissions: ["MANAGE_ROLES"],
        clientPermissions: ["MANAGE_ROLES"],
        tags: ["guildOnly"],
        aliases: ["gp", "give"],
        usage: "givepotato <user> <tag>"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		if (!ctx.args[0]) return ctx.send(`no 1`)
        let result = getUser(ctx.message, ctx.args[0])
        if (!result) return ctx.send(`no 2`)
		if (!ctx.args[1]) return ctx.send(`no 3`)
        query(`SELECT * FROM roles`, async(err:MysqlError, res: {id:string, tag: string, description: string, link: string}[]) => {
            if (!res.find(r => r.tag === ctx.args[1])) return ctx.send("no")
            result?.roles.add(res.find(r => r.tag === ctx.args[1])?.id??"").then(_ => {
                query(`SELECT * FROM users WHERE id = "${result?.id}"`, async (err: MysqlError, res2: {id: string, potatoes: number}[]) => {
                    let number = 0
                    for (const role of res) {
                        if (result?.roles.cache.has(role.id)) number ++
                    }
                    console.log(res2)
                    console.log(res)
                    if (!res2.length) {
                        query(`INSERT INTO users (id, potatoes) VALUES ("${result?.id}", "${number}")`)
                    } else {
                        query(`UPDATE users SET potatoes = "${number}" WHERE id = "${result?.id}"`)
                    }
                    ctx.delete()
                    ctx.send(`:white_check_mark: - Done sir !`).then(m => m.delete({timeout: 5000}))
                })
            })
        })
	}
);