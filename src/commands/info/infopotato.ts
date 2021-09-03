import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getRole } from '../../functions/get';


export default new Command(
	{
		name: 'infopotato',
		description: "Give some information about a potato",
        aliases: ["ip","potatoinfo", "pi"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send(`:x: - Veuillez indiquer une patate`)
		query(`SELECT * FROM roles`, (err:MysqlError, roles: {id:string, tag: string, description: string, link: string}[]) => {
            let patate = roles.find(r => r.tag === ctx.args[0])
            if (!patate) {
                patate = roles.find(r => r.id === getRole(ctx.message, ctx.args[0])?.id)
                if (!patate) return ctx.send(`:x: - Tag invalide. Les tags sont obtenable via \`potatolist\``)
            }
            const role = ctx.guild?.roles.cache.get(patate.id)
            let numbers = []
            for (const r of roles) {
                numbers.push({
                    number: ctx.guild?.roles.cache.get(r.id)?.members.size??0,
                    id: r.id
                })
            }
            numbers.sort((a, b) => b.number - a.number)
            const me = numbers.findIndex(r => r.id === patate?.id)
            let txt = patate.link !== "none" ? `[${patate.description}](${patate.link})` : patate.description
            const embed = new BetterEmbed({
                color: '#f1c40f',
                title: `Information about ${role?.name}`,
                description: `This potato is the ${(me === 0 ? '1st' : (me === 1 ? '2nd' : (me === 2 ? '3rd' : (me+1)+'th')))} most found with ${numbers.find(n => n.id === patate?.id)?.number} cubes having found it\n\n${txt}`,
                footer: {
                    text: `His tag is ${patate.tag} | His role id is ${patate.id}`
                }
            })
            ctx.send(embed)
        })
	}
);