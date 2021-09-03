import { CommandInteraction, GuildMember, MessageEmbed, MessageInteraction } from "discord.js";
import { MysqlError } from "mysql";
import { query } from "../..";
import { Bot, Command } from "../../utils/class";

export default new Command(
    {
        name: "info",
        description: "Get information on your rank and some other things",
        options: [
            {
                type: "USER",
                name: "user",
                description: "The user you want information on",
                required: false
            }
        ]
    },
    async (client: Bot, interaction: CommandInteraction) => {
        let member = (interaction.options.getMember("user", false) as GuildMember) ?? (interaction.guild?.members.cache.get(interaction.user.id) as GuildMember)
        query(`SELECT * FROM roles`, (err: MysqlError, roles: {id:string, description: string, link: string}[]) => {
            query(`SELECT * FROM users`, (err: MysqlError, users: {id: string, potatoes: number}[]) => {
                const embed = new MessageEmbed({
                    title: `Profil of ${member?.displayName} | 🥔`,
                    color: '#f1c40f'
                })
                let number = 0
                for (const r of roles) {
                    if (member?.roles.cache.has(r.id)) {
                        number ++
                        embed.fields.push({
                            name: '• ' + interaction.guild?.roles.cache.get(r.id)?.name,
                            value: r.link !== "none" ? `[${r.description}](${r.link})` : r.description,
                            inline: true
                        })
                    }
                }
                if (!users.find(u => u.id === member?.id)) {
                    users.push({
                        id: member?.id??"",
                        potatoes: number
                    })
                    query(`INSERT INTO users (id, potatoes) VALUES ("${member?.id}", "${number}")`)
                } else {
                    query(`UPDATE users SET potatoes = "${number}" WHERE id = "${member?.id}"`)
                }
                users.sort((a, b) => b.potatoes - a.potatoes)
                const me = users.findIndex(u => u.id === member?.id)
                embed.description = `He is the ${(me === 0 ? '1st' : (me === 1 ? '2nd' : (me === 2 ? '3rd' : (me+1)+'th')))} with ${number} potato(es)`
                interaction.reply({embeds: [embed]})
            })
        })
    }
)