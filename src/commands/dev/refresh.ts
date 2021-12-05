import { CommandInteraction } from 'discord.js';
import { MysqlError } from 'mysql';

import { query } from '../..';
import { Bot, Command } from '../../utils/class';

export default new Command(
	{
		name: 'refresh',
		description: 'DANGER HERE',
        defaultPermission: false
	},
	async (client: Bot, interaction: CommandInteraction) => {
		query("SELECT * FROM roles", async(err: MysqlError, res: {id: string, description: string, link: string}[]) => {
            const roles = res.map(r => r.id)
            if (!interaction.guild) return
            let info: string
            const msg = await interaction.reply({content:"Working..."})
            const interval = setInterval(function() {
                interaction.editReply({content: info})
            }, 2000)
            let counter = 0
            for (const m of interaction.guild.members.cache.map(m => m)) {
                counter ++
                info = `Updating user ${counter}/${interaction.guild?.members.cache.size}`
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
                    info = `Updated user ${counter}/${interaction.guild?.members.cache.size}`
                })
            }
            clearInterval(interval)
            interaction.editReply({content: "Finished"})
        })
	},
    {
        user: {
            dev: true
        }
    }
);
