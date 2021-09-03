import { CommandInteraction, MessageEmbed, MessageInteraction } from "discord.js";
import { MysqlError } from "mysql";
import { query } from "../..";
import { Bot, Command } from "../../utils/class";

export default new Command(
    {
        name: "infopotato",
        description: "Get some information about a potato",
        options: [
            {
                name: "potato",
                type: "ROLE",
                description: "The potato you want information on",
                required: true
            }
        ]
    },
    async (client: Bot, interaction: CommandInteraction) => {
        const potato = interaction.options.getRole("potato", true)
        query(`SELECT * FROM roles`, (err:MysqlError, roles: {id:string, description: string, link: string}[]) => {
            let patate = roles.find(r => r.id === potato.id)
            if (!patate) return interaction.reply({content: `:x: - Wrong role this is not a potato role`, ephemeral: true})
            let numbers = []
            for (const r of roles) {
                numbers.push({
                    number: interaction.guild?.roles.cache.get(r.id)?.members.size??0,
                    id: r.id
                })
            }
            numbers.sort((a, b) => b.number - a.number)
            const me = numbers.findIndex(r => r.id === patate?.id)
            let txt = patate.link !== "none" ? `[${patate.description}](${patate.link})` : patate.description
            const embed = new MessageEmbed({
                color: '#f1c40f',
                title: `Information about ${potato?.name}`,
                description: `This potato is the ${(me === 0 ? '1st' : (me === 1 ? '2nd' : (me === 2 ? '3rd' : (me+1)+'th')))} most found with ${numbers.find(n => n.id === patate?.id)?.number} cubes having found it\n\n${txt}`,
            })
            interaction.reply({embeds: [embed]})
        })
    }
)