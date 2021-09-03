import { CommandHandler } from "advanced-command-handler"
import { Intents } from "discord.js"
import {owners} from "./config.json"

require('dotenv').config()

process.chdir('out')

CommandHandler.create({
    prefixes: ['&'],
    commandsDir: "commands",
    eventsDir: "events",
    owners: owners
}).launch({
    token: process.env.TOKEN ?? "",
    clientOptions: {
        ws: { 
            intents: Intents.ALL
        },
        restTimeOffset: 100,
        disableMentions: 'everyone',
        messageCacheMaxSize: 100
    }
})