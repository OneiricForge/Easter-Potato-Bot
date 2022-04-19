import { CommandInteraction, GuildMember } from 'discord.js';

import { db } from '../..';
import { Bot, Command } from '../../utils/class';

export default new Command(
	{
		name: 'givepotato',
		description: 'Give a potato',
        options: [
            {
                type: "USER",
                name: "user",
                description: "The user to give a potato",
                required: true
            },
            {
                type: "ROLE",
                name: "potato",
                description: "The potato to give",
                required: true
            }
        ],
        defaultPermission: false
	},
	async (client: Bot, interaction: CommandInteraction) => {
        const role = interaction.options.getRole("potato", true)
        const user = (interaction.options.getMember("user", true) as GuildMember)
        db.all(`SELECT * FROM roles`, (err, roles: {id:string, description: string, link: string}[]) => {
            if (!roles.find(r => r.id === role.id)) return interaction.reply({content: `:x: - Wrong role this is not a potato role`, ephemeral: true})
            user.roles.add(role.id).then(_ => {
                db.all(`SELECT * FROM users WHERE id = "${user?.id}"`, async (err, res2: {id: string, potatoes: number}[]) => {
                    let number = 0
                    for (const role of roles) {
                        if (user?.roles.cache.has(role.id)) number ++
                    }
                    if (!res2.length) {
                        db.run(`INSERT INTO users (id, potatoes) VALUES ("${user?.id}", "${number}")`)
                    } else {
                        db.run(`UPDATE users SET potatoes = "${number}" WHERE id = "${user?.id}"`)
                    }
                    interaction.reply({content: `:white_check_mark: - Done sir !`, ephemeral: true})
                })
            })
        })
	},
    {
        user: {
            mod: true
        }
    }
);
