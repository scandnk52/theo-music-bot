const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "karıştır",
    description: "Listedeki şarkıların sırasını karıştırır.",
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

        if (queue.songs.length <= 2) {
            return interaction.reply({content: ":x: Bunu yapabilmem için sırada en az 3 şarkı olması gerek!", ephemeral: true});
        }

        queue.shuffle();
        return interaction.reply({content: `:twisted_rightwards_arrows: **${queue.songs.length}** şarkı başarıyla karıştırıldı!`});

	},
};