const { Client, GatewayIntentBits, Collection, } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require("@distube/yt-dlp");

require("dotenv").config();

class Bot extends Client {

    constructor() {
        super({
            shards: "auto",
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ],
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
        });
        
        this.commands = new Collection();

        this.handlers.map((path) => require(path)(this));

        this.distube = new DisTube(this, {
            searchSongs: 5,
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 30,
            leaveOnFinish: false,
            leaveOnStop: true,
            plugins: [
                new YtDlpPlugin()
            ],
        });  
    }

    handlers = [
        './handlers/loadCommands',
        './handlers/loadEvents',
        './handlers/uploadCommands'
    ];

    connect() {
        super.login(process.env.TOKEN);
    }

}

module.exports = Bot;