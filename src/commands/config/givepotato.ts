import {CommandInteraction, GuildMember} from 'discord.js';
import { MysqlError } from 'mysql';
import { query } from '../..';
import {Command, Bot} from '../../utils/class/index';

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
        ]
	},
	async (client: Bot, interaction: CommandInteraction) => {
        const role = interaction.options.getRole("potato", true)
        const user = (interaction.options.getMember("user", true) as GuildMember)
        query(`SELECT * FROM roles`, (err: MysqlError, roles: {id:string, description: string, link: string}[]) => {
            if (!roles.find(r => r.id === role.id)) return interaction.reply({content: `:x: - Wrong role this is not a potato role`, ephemeral: true})
            user.roles.add(role.id).then(_ => {
                query(`SELECT * FROM users WHERE id = "${user?.id}"`, async (err: MysqlError, res2: {id: string, potatoes: number}[]) => {
                    let number = 0
                    for (const role of roles) {
                        if (user?.roles.cache.has(role.id)) number ++
                    }
                    if (!res2.length) {
                        query(`INSERT INTO users (id, potatoes) VALUES ("${user?.id}", "${number}")`)
                    } else {
                        query(`UPDATE users SET potatoes = "${number}" WHERE id = "${user?.id}"`)
                    }
                    interaction.reply({content: `:white_check_mark: - Done sir !`, ephemeral: true})
                })
            })
        })
	}
);
