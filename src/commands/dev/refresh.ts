import { Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';


export default new Command(
	{
		name: 'refresh',
		description: "DANGER HERE",
        tags: [Tag.ownerOnly, "guildOnly"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        query("SELECT * FROM roles", async(err: MysqlError, res: {id: string, tag: string, description: string, link: string}[]) => {
            const roles = res.map(r => r.id)
            if (!ctx.guild) return
            let info: string
            const msg = await ctx.send("Working...")
            const interval = setInterval(function() {
                msg.edit(info)
            }, 2000)
            let counter = 0
            for (const m of ctx.guild.members.cache.array()) {
                counter ++
                info = `Updating user ${counter}/${ctx.guild?.members.cache.size}`
                query("SELECT * FROM users WHERE id = '"+m.user.id+"'", (err: MysqlError, res: {id: string, potatoes: number}[]) => {
                    let potatoes = 0
                    for (const r of roles) {
                        if (m.roles.cache.has(r)) {
                            potatoes ++
                        }
                    }
                    if (!res.length) {
                        query('INSERT INTO users (id, potatoes) VALUES ("'+m.user.id+'", "'+potatoes+'")')
                    } else {
                        query(`UPDATE users SET potatoes = "${potatoes}" WHERE id = "${m.user.id}"`)
                    }
                    info = `Updated user ${counter}/${ctx.guild?.members.cache.size}`
                })
            }
            clearInterval(interval)
            msg.edit("Finished")
        })
	}
);