const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

const config = {
    name: "sözler",
    description: "Şarkının sözlerini bulur.",
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

        if (interaction.type == 2) await interaction.deferReply();

        const lyrics = await lyricsFinder(queue.songs[0].name);

        if (lyrics) {

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(queue.songs[0].name)
                .setDescription(lyrics)
                .setThumbnail(queue.songs[0].thumbnail)
                .setTimestamp()
                .setFooter({text: queue.songs[0].uploader.name});

            return interaction.editReply({embeds: [embed]});

        } else {
            return interaction.editReply({content: ":x: Bu şarkıya ait sözleri bulamadım!"});
        }

	},
};