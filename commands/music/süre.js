const { SlashCommandBuilder } = require('discord.js');
const format = require('format-duration');

const config = {
    name: "süre",
    description: "Şarkının süresini gösterir.",
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

        const currentTime = () => {

            const bar = 20;
            const singleBar = queue.songs[0].duration / bar;
            const nowTime = Math.floor(queue.currentTime / singleBar);
            const notReachedTime = bar - nowTime;

            return `${nowTime > 0 ? "**" : ""}${"-".repeat(nowTime)}${nowTime > 0 ? "**" : ""}${"-".repeat(notReachedTime)}`;

        }

        return interaction.reply({content: `**${queue.songs[0].name}**\n:pause_button: **${format(queue.currentTime * 1000)}** ${currentTime()} **${format(queue.songs[0].duration * 1000)}**`});

	},
};