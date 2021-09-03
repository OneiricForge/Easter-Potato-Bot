# Easter Potato Bot
## A bot to collect Easter Potatoes that you can find on the OneiricForge's projects

Just send them in [#easter-potato](https://discord.com/channels/701176979583401994/754451096033820712) and the bot will take action : 
- Delete the message so no one can cheat by stealing your potato
- Resend it in a private channel where the "Forgerons" can accept it or not
- And give you an amazing role if you find it

# Features

- Help command

![help command](https://i.imgur.com/ufC1zKQ.png)
- Information on potatoes availables

![infopotato command](https://i.imgur.com/0iRfczl.png)
- List all the potatoes availables (and you can find them in fantomitechno's role ![kappa](https://cdn.discordapp.com/emojis/820717744906829855.png?size=20))

![potatolist command](https://i.imgur.com/yCb8mU9.png)
- Give a top for the most potatoes collected (with reactions to see the different pages)

![top command](https://i.imgur.com/60otsjk.png)
- All the config commands (sorry but no screenshot are availables)

# Contributing
Fell free to contribute

# Setup
You will need a MySql server with the tables :
> roles: 
> - id: varchar(19) NOT NULL
> - tag: text NOT NULL
> - description: text NOT NULL
> - link: text DEFAULT NULL
> users: 
> - id: varchar(19) NOT NULL
> - potatoes: int(11) NOT NULL

(We use MariaDB and PhpMyAdmin)

If you don't use it in `localhost` you will have to change `./src/config.json` to match your configuration

Do `npm i` to download all the packages

**Warning there is a specifity on the configuration of this bot : it us a modified version of Advanced-Command-Handler :**

> I change the `./node_modules/advanced-command-handler/types/types.d.ts` more precisly the line 11 : 
```ts
// Before
export declare type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
// After 
export declare type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, context: any) => Promise<void>;
```

Create a `.env` file filed with :
```
TOKEN=YOURTOKEN
DATABASE_PASS=YOURPASSWORD
DATABASE_USER=YOURUSER
```

And finally you can launch the bot with `npm start`

If you're using something as pm2 you can build it your self with `tsc` and launch the file `./out/index.js`