import { BetterEmbed } from "advanced-command-handler";
import { Context } from "../class/Context";

export const pagination = (ctx: Context, tab: string[]|string[][], title: string, page: number = 0, type: "description"|"field" = "description", inline: boolean = (type === "description" ? false : true)) => {
    const maxPages = Math.floor(tab.length/10.0000000001)
    let baseEmbed = new BetterEmbed({
        title: title,
        color: '#f1c40f',
        footer: {text: `(${page+1}/${maxPages+1})`}
    })

    let text = tab.slice(page*10, (page+1)*10)
    if (type === "description") {
        baseEmbed.description = text.join(`\n`)
    } else {
        for (const t of text) {
            baseEmbed.fields.push({
                name: t[0],
                value: t[1],
                inline: inline
            })
        }
    }
    ctx.send({embed: baseEmbed}).then(async m => {
        if (ctx.guild && !ctx.guild.me?.hasPermission(`ADD_REACTIONS`)) return m.edit({content: `Je n'ai pas la permission d'ajouter des réactions`, embed: null})
        await m.react("⬅️")
        await m.react("❌")
        await m.react("➡️")

        const data_res = m.createReactionCollector((r, u) => ["⬅️", "❌", "➡️"].includes(r.emoji.name) && u.id === ctx.author.id, {time: 120000})
        data_res.on("collect", async (r) => {
            if (r.emoji.name === "❌") {
                if (ctx.guild?.me?.hasPermission(`MANAGE_MESSAGES`)) m.reactions.removeAll()
                return data_res.stop()
            }
            if (r.emoji.name === "⬅️" && page !== 0) page --
            if (r.emoji.name === "➡️" && page < maxPages) page ++

            baseEmbed.footer = {text: `(${page+1}/${maxPages+1})`}

            let text = tab.slice(page*10, (page+1)*10)
            if (type === "description") {
                baseEmbed.description = text.join(`\n`)
            } else {
                for (const t of text) {
                    baseEmbed.fields = []
                    baseEmbed.fields.push({
                        name: t[0],
                        value: t[1],
                        inline: inline
                    })
                }
            }
            m.edit(baseEmbed)

            if (ctx.guild?.me?.hasPermission(`MANAGE_MESSAGES`)) r.users.remove(ctx.author.id)
        })

        data_res.on(`end`, async (_, err) => {
            if (err === "time" && ctx.guild?.me?.hasPermission(`MANAGE_MESSAGES`)) m.reactions.removeAll()
        })
    })
}