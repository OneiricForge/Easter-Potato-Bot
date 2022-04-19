import { CommandInteraction } from 'discord.js';

import { db } from '../..';
import { Bot, Command } from '../../utils/class';

export default new Command(
	{
		name: 'removepotato',
		description: 'Delete a potato',
        options: [
            {
                type: "ROLE",
                name: "potato",
                description: "The potato to remove",
                required: true
            }
        ],
        defaultPermission: false
	},
	async (client: Bot, interaction: CommandInteraction) => {
        const role = interaction.options.getRole("potato", true)
        db.all(`SELECT * FROM roles`, (err, roles: {id:string, description: string, link: string}[]) => {
            if (!roles.find(r => r.id === role.id)) return interaction.reply({content: `:x: - Wrong role this is not a potato role`, ephemeral: true})
            interaction.guild?.roles.cache.get(role.id)?.delete()
            db.run(`DELETE FROM roles WHERE id = "${role.id}"`)
            interaction.reply({content: `:white_check_mark: - Done sir !`, ephemeral: true})
        })
	},
    {
        user: {
            mod: true
        }
    }
);
