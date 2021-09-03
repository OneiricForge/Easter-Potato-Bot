import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';


export default new Command(
	{
		name: 'fant0mib0t'
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		let embed = new BetterEmbed({
            title: "Secret potato",
            description: "Hey OneiricForge fan. You found a secret potato: for the moment, I don’t know if Silvathor found it himself but send there with a screenshot of that message and then wait and watch\" -fantomitechno",
            footer: {text: "Secret of fantomitechno, shhh 🤫",},
            color: '#f1c40f'
        })
        embed.setImage("https://media.discordapp.net/attachments/829643820174016543/831904293342806016/2021-04-09_13.54.35.png")
        ctx.delete()
        ctx.author.send(embed)
	}
);