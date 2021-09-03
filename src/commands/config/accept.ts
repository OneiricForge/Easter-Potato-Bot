import { Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getUser } from '../../functions/get';


export default new Command(
	{
		name: 'accept',
		description: "Allow you to accept a potato and give the Potato to someone",
        userPermissions: ["MANAGE_ROLES"],
        clientPermissions: ["MANAGE_ROLES"],
        aliases: ["agree", "yes"],
        tags: ["guildOnly"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (ctx.channel.id !== "829741063941521488" || !ctx.guild) return
        ctx.channel.messages.fetch().then(async msgs => {
            console.log(msgs.array().map(m => m.embeds))
            if (msgs.array().filter(m => m.embeds.length === 1 && m.content === '').filter(m=> m.embeds[0].description?.startsWith('Pour donner le rôle lié faites "accept <patate id>"')).filter(m=> m !== undefined).length === 0) return ctx.send('ERROR CONTACTER FANTO').then(m => m.delete({timeout: 2000}))
            let msg = msgs.array().filter(m => m.embeds.length === 1 && m.embeds[0].type === 'rich' && m.content === '').filter(m=> m.embeds[0].description?.startsWith('Pour donner le rôle lié faites "accept <patate id>"')).filter(m=> m !== undefined)[0]
            query(`SELECT * FROM roles`, async (err: MysqlError, res: {id:string, tag: string, description: string, link: string}[]) => {
                if (!res.filter(r => r.tag === ctx.args[0]).length) {
                    let m = await ctx.send(`:x: - Tag invalide. Les tags sont obtenable via \`potatolist\``)
                    m.delete({timeout:500})
                    return
                }
                let result = await getUser(ctx.message, msg.embeds[0].footer?.text??"")
                if (!result) {
                    let m = await ctx.send(`:x: - Euh, l'ami voulant sa patate nous a quité :sob:`)
                    m.delete({timeout:500})
                    return
                }
                if (result.roles.cache.has(res.filter(r => r.tag === ctx.args[0])[0].id)) {
                    let m = await ctx.send(`:x: - Euh, l\'ami voulant sa patate l\'a déja :confused:`)
                    m.delete({timeout:500})
                    return 
                }
                result.roles.add(res.filter(r => r.tag === ctx.args[0])[0].id).then(_ => {
                    query(`SELECT * FROM users WHERE id = "${result?.id}"`, async (err: MysqlError, res2: {id: string, potatoes: number}[]) => {
                        let number = 0
                        for (const role of res) {
                            if (result?.roles.cache.has(role.id)) number ++
                        }
                        if (!res2.length) {
                            query(`INSERT INTO users (id, potatoes) VALUES ("${result?.id}", "${number}")`)
                        } else {
                            query(`UPDATE users SET potatoes = "${number}" WHERE id = "${result?.id}"`)
                        }
                        msg.delete()
                        ctx.delete()
                        ctx.send(`:white_check_mark: - Done sir !`).then(m => m.delete({timeout: 5000}))
                        result?.send(`The potato you sent was successfully given to you : ${ctx.guild?.roles.cache.get(res.filter(r => r.tag === ctx.args[0])[0].id)?.name}`)
                    })
                })
            })
        })
	}
);