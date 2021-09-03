import { BetterEmbed, Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';


export default new Command(
	{
		name: 'faq',
		description: "What's this bot for ?",
        tags: [Tag.guildOnly],
        aliases: ["foire-au-question", "botinfo"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		query(`SELECT * FROM users`, (err: MysqlError, res: {id: string, potatoes: number}[]) => {
            let users = res.sort((a, b) => b.potatoes - a.potatoes)
            let embed = new BetterEmbed({
                title: "FAQ  | 🥔",
                color: '#f1c40f',
                fields: [
                    {
                        name: "Who am I ?",
                        value: "• :flag_fr: Bonjour, je suis "+handler.client?.user?.username+". Je sert à compter le nombre d'\"Easter Potatoes\" que vous avez trouvé sur les maps d'OnericForge !\n*Ma création venait d'une blague de @fantomitechno 🦊#5973 qui a plutôt bien fini*\n\n• :flag_gb: Hi, I'm "+handler.client?.user?.username+". I count the number of \"Easter Potatoes\" you found on the OnericForge's maps!\n*My creation is the result of a joke by @fantomitechno 🦊#5973 that ended pretty well*",
                        inline: true
                    },
                    {
                        name: "What are \"Easter Potatoes\" ?",
                        value: "• :flag_fr: Dans les cartes d'OneirciForge, les <@&701178173139714069> s'amusent à cacher un coffre dans lequel se trouve 42 pommes de terre enchantées. A vous de les trouver pour vous hisser dans le classement et peut être dépasser "+ctx.guild?.members.cache.get(users[0].id)?.displayName+" !\n\n• :flag_gb: In the maps of OneiricForge, the <@&701178173139714069> have fun hiding a chest containing 42 enchanted potatoes. It's up to you to find them to move you up in the rankings and maybe exceed "+ctx.guild?.members.cache.get(users[0].id)?.displayName+"!",
                        inline: true
                    }
                ]
            })
            ctx.send(embed)
        })
	}
);