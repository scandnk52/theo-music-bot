const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "geç",
    description: "Şarkıyı atlar ve bir sonraki şarkıya geçer.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description),
	async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için bir ses kanalında olman gerek!", ephemeral: true});
		}

        if(interaction.guild.members.me.voice.channel && voiceChannel.id !== interaction.guild.members.me.voice.channel.id) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için aynı ses kanalında olmamız gerek!", ephemeral: true});
		}

        const queue = await interaction.client.distube.getQueue(voiceChannel);
            
        if(!queue || !queue.songs || queue.songs.length == 0) {
            return interaction.reply({content: ":x: Şu anda çalan herhangi bir şarkı yok!", ephemeral: true});
        }

        try {
            await queue.skip();
            return interaction.reply({content: ":fast_forward: Şu anda çalan şarkı atlandı!"});
        } catch (e) {
            if (e.errorCode === "NO_UP_NEXT") {
                return interaction.reply({content: ":x: Şu anda sırada şarkı yok!", ephemeral: true});
            }
            return interaction.reply({content: ":x: Beklenmedik bir hata oluştu!", ephemeral: true});
        }

	},
};