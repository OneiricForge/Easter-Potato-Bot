import { CommandInteraction } from 'discord.js';

import { db } from '../..';
import { Bot, Command } from '../../utils/class';

export default new Command(
	{
		name: 'addpotato',
		description: 'Create a potato',
        options: [
            {
                type: "STRING",
                name: "name",
                description: "The name of the potato",
                required: true
            },
            {
                type: "STRING",
                name: "description",
                description: "The description of the potato",
                required: true
            },
            {
                type: "STRING",
                name: "link",
                description: "Link of the potato",
                required: false
            },
            {
                type: "ROLE",
                name: "role",
                description: "If you want to use an existing role"
            }
        ],
        defaultPermission: false
	},
	async (client: Bot, interaction: CommandInteraction) => {
		const name = interaction.options.getString("name", true)
        const description = interaction.options.getString("description", true)
        let link = interaction.options.getString("link", false)
        if (link && !link.includes('http')) return interaction.reply({content: ":x: - Veuillez indiquer le lien où on peut trouver cette patate (le lien de la map)", ephemeral: true})
        const role = interaction.options.getRole("role", false)

        if (!role) {
            interaction.guild?.roles.create({
                name,
                color: '#f1c40f'
            }).then(async r => {
                db.run(`INSERT INTO roles (id, link, description) VALUES ("${r.id}", "${link??"none"}", "${description}")`)
                interaction.reply({content:`:white_check_mark: - Nouvelle patate créé`, ephemeral: true})
            })
        } else {
            db.run(`INSERT INTO roles (id, link, description) VALUES ("${role.id}", "${link??"none"}", "${description}")`)
            interaction.reply({content:`:white_check_mark: - Nouvelle patate créé`, ephemeral: true})
        }
	},
    {
        user: {
            mod: true
        }
    }
);
