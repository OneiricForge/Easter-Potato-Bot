import { Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getRole } from '../../functions/get';


export default new Command(
	{
		name: 'addpotato',
		description: "Create a potato",
        userPermissions: ["MANAGE_ROLES"],
        clientPermissions: ["MANAGE_ROLES"],
        tags: ["guildOnly"],
        aliases: ["ap","np","newpotato"],
        usage: "addpotato <name> ; <tag> ; <link> ; <description>"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		const argsspe = ctx.args.join(" ").split(" ; ")
        if (!argsspe[0]) return ctx.send(`:x: - Veuillez indiquer un rôle/nom`)
        const result = getRole(ctx.message, argsspe[0])
        if (!argsspe[1]) return ctx.send(`:x: - Veuillez indiquer un tag`)
        if (!argsspe[2] || (!argsspe[2].includes('http') && argsspe[2].toLowerCase() !== 'none')) return ctx.send(":x: - Veuillez indiquer le lien où on peut trouver cette patate (le lien de la map) ou indiquer `none`")
        if (!argsspe[3]) return ctx.send(`:x: - Veuillez indiquer une description`)
        if (!result) {
            ctx.guild?.roles.create({data:{
                name: argsspe[0],
                color: '#f1c40f'
            }}).then(async r => {
                query(`INSERT INTO roles (id, link, description, tag) VALUES ("${r.id}", "${argsspe[2]}", "${argsspe[3]}", "${argsspe[1]}")`)
                ctx.send(`:white_check_mark: - Nouvelle patate créé`)
            })
        } else {
            query(`INSERT INTO roles (id, link, description, tag) VALUES ("${result.id}", "${argsspe[2]}", "${argsspe[3]}", "${argsspe[1]}")`)
            ctx.send(`:white_check_mark: - Nouvelle patate enregistré`)
        }
	}
);