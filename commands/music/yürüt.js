const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "yürüt",
    description: "Durdurulan müziği oynatmak için kullanılır.",
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

        if (queue.paused) {
            queue.resume(voiceChannel);
            return interaction.reply({content: ":arrow_forward: Müzik devam ediyor!"});
        }

        queue.distube.pause(voiceChannel);
        return interaction.reply({content: ":pause_button: Müzik durduruldu!"});

	},
};