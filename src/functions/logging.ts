import { Guild, Message, MessageEmbed, NewsChannel, TextChannel, User } from "discord.js";
import { BetterEmbed } from "discord.js-better-embed/dist";
import { unlinkSync } from "fs";
import { getLog } from "./get";


export const sendToModLogs = (guild: Guild | null, content: string, type: string) => {
    if (!guild) return
    let logEmbed = new BetterEmbed({
        title: `Nouveau ${type}`,
        description: content,
        hexColor: "#3498db"
    })
    const channel: TextChannel|NewsChannel|"no channel finded" = getLog(guild)
    if (channel === "no channel finded") return
    channel?.send(logEmbed)
}

export const sendToLogs = async (channel: TextChannel|NewsChannel,type: {emote: string,message: string,color: string}, user:User|"none",message: string,mod: string, image: string|null, fichier: string|null = null) => {
    if (!channel) return
    let date = new Date()
    let embed = new MessageEmbed()
      .setColor(type.color)
      .addField(`${type.emote} ${type.message}`,message)
      .setTimestamp(date)
    if (user != 'none') embed.setAuthor(user.tag, user.displayAvatarURL({dynamic:true}))
    if (image) embed.setImage(image)
    let msg = await channel.send(embed)
    let msg2: Message
    if (fichier) {
        msg2 = await channel.send("",{ files: [fichier]})
        unlinkSync(fichier)
    }
    await msg.react('🗑️')
    let collector = msg.createReactionCollector((reaction, user) => ((channel.guild.members.cache.get(user.id)?.roles.cache.has(mod) || channel.guild.member(user)?.hasPermission("ADMINISTRATOR"))??false) && reaction.emoji.name === "🗑️", { max: 1, time: 20000 });
    collector.on("collect", async(reaction, users) => {
        let embed = new MessageEmbed()
          .setColor(type.color)
          .addField(`${type.emote} ${type.message}`,users.tag+' a supprimé cette entrée')
          .setFooter('Ne peux plus être supprimer')
          .setTimestamp(date)
        if (user != 'none') embed.setAuthor(user.tag, user.displayAvatarURL({dynamic:true}))
        msg.edit(embed)
        if (fichier) msg2.delete()
        collector.stop()
    })
    collector.on("end", (collection, reason) =>{
        msg.reactions.removeAll()
        if (reason != 'time') return
        let embed = new MessageEmbed()
          .setColor(msg.embeds[0].color??"")
          .addField(msg.embeds[0].fields[0].name,msg.embeds[0].fields[0].value)
          .setFooter('Ne peux plus être supprimer')
          .setTimestamp(date)
        if (user != 'none') embed.setAuthor(user.tag, user.displayAvatarURL({dynamic:true}))
        if (image) embed.setImage(image)
        msg.edit(embed)
    })
    return msg
}