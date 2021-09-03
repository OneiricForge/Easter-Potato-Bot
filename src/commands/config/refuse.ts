import { Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';
import { getUser } from '../../functions/get';


export default new Command(
	{
		name: 'refuse',
		description: "Allow you to refuse a potato to someone",
        userPermissions: ["MANAGE_ROLES"],
        tags: ["guildOnly"],
        aliases: ["disagree", "no"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (ctx.channel.id !== "829741063941521488" || !ctx.guild) return
        ctx.channel.messages.fetch().then(async msgs => {
            if (msgs.array().filter(m => m.embeds.length === 1 && m.embeds[0].type === 'rich' && m.content === '').filter(m=> m.embeds[0].description?.startsWith('Pour donner le rôle lié faites "accept <patate id>"')).filter(m=> m !== undefined).length === 0) return ctx.send('ERROR CONTACTER FANTO').then(m => m.delete({timeout: 2000}))
            let msg = msgs.array().filter(m => m.embeds.length === 1 && m.embeds[0].type === 'rich' && m.content === '').filter(m=> m.embeds[0].description?.startsWith('Pour donner le rôle lié faites "accept <patate id>"')).filter(m=> m !== undefined)[0]
            let result = await getUser(ctx.message, msg.embeds[0].footer?.text??"")
            if (!result) {
                let m = await ctx.send(':x: - Euh, l\'ami voulant sa patate nous a quité :sob:')
                m.delete({timeout:200})
                return
            }
            msg.delete()
            ctx.delete()
            ctx.send(`:white_check_mark: - Done sir !`).then(m => m.delete({timeout: 5000})).then(m => m.delete({timeout: 5000}))
            result.send(`The potato you sent was refused${ctx.args[0] ? ` for the reason : "${ctx.args.join(' ')}"`: '.'}`)
        })
	}
);