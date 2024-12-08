const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "ses",
    description: "Şarkının sesini ayarlar.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
        .addIntegerOption(option => 
            option.setName('seviye')
            .setDescription('Ayarlamak istediğiniz ses seviyesi (0-100)')
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(0)),
	async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        const volume = interaction.options.getInteger("seviye");

        if (!voiceChannel) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için bir ses kanalında olman gerek!", ephemeral: true});
		}

        if(interaction.guild.members.me.voice.channel && voiceChannel.id !== interaction.guild.members.me.voice.channel.id) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için aynı ses kanalında olmamız gerek!", ephemeral: true});
		}

        if (!volume) {
            const volume = await interaction.client.distube.getQueue(voiceChannel).volume;
            return await interaction.reply({content: `:loud_sound: Şarkının ses seviyesi şu anda **%${volume}**!`});
        }

        const queue = await interaction.client.distube.getQueue(voiceChannel);
            
        if(!queue || !queue.songs || queue.songs.length == 0) {
            return interaction.reply({content: ":x: Şu anda çalan herhangi bir şarkı yok!", ephemeral: true});
        }
            
        interaction.client.distube.setVolume(voiceChannel, volume);

        const emoji = () => {

            if (volume > 0 && volume < 30) {
                return ":speaker:";
            } else if (volume > 30 && volume < 70) {
                return ":sound:";
            } else if (volume > 70 && volume <= 100) {
                return ":loud_sound:";
            } else {
                return ":mute:";
            }

        }

        return await interaction.reply({content: `${emoji()} Şarkının ses seviyesi **%${volume}** olarak ayarlandı!`});

	},
};