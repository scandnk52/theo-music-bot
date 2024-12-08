const { SlashCommandBuilder } = require('discord.js');
const format = require('format-duration');

const config = {
    name: "sar",
    description: "Şarkıyı istenilen süreye sarar.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
        .addIntegerOption(option => 
            option.setName('süre')
            .setDescription('Gitmek istediğiniz süre')
            .setRequired(true)
            .setMinValue(0)),
	async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        const time = interaction.options.getInteger("süre");

        if (!voiceChannel) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için bir ses kanalında olman gerek!", ephemeral: true});
		}

        if(interaction.guild.members.me.voice.channel && voiceChannel.id !== interaction.guild.members.me.voice.channel.id) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için aynı ses kanalında olmamız gerek!", ephemeral: true});
		}

        const queue = await interaction.client.distube.getQueue(voiceChannel);
        const duration = queue.songs[0].duration;
            
        if(!queue || !queue.songs || queue.songs.length == 0) {
            return interaction.reply({content: ":x: Şu anda çalan herhangi bir şarkı yok!", ephemeral: true});
        }

        const seek = time > duration ? duration : time;

        await queue.seek(seek);
        return interaction.reply({content: `:fast_forward: Şarkı **${format(seek * 1000)}** süresinden oynatılmaya devam edilecek!`});

	},
};