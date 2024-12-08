const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "çal",
    description: "Şarkı çalmak için kullanılır.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
		.addStringOption(option =>
			option
				.setName('şarkı')
				.setRequired(true)
				.setDescription('Açmak istediğiniz şarkı')),
	async execute(interaction) {

		const voiceChannel = interaction.member.voice.channel;
		const music = interaction.options.getString("şarkı");

		if (!voiceChannel) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için bir ses kanalında olman gerek!", ephemeral: true});
		}

		if(interaction.guild.members.me.voice.channel && voiceChannel.id !== interaction.guild.members.me.voice.channel.id) {
			return await interaction.reply({content: ":x: Bunu yapabilmen için aynı ses kanalında olmamız gerek!", ephemeral: true});
		}

		if (interaction.type == 2) await interaction.deferReply();

		try {

			interaction.client.distube.play(voiceChannel, music, { textChannel: interaction.channel, member: interaction.member, voiceChannel: voiceChannel});

			return interaction.deleteReply();

		} catch (e) {
			if (e.errorCode === "NO_RESULT") {
				return interaction.reply({content: ":mag_right: Ne yazık ki herhangi bir şarkı bulamadım!", ephemeral: true});
			}
			return await interaction.reply({content: ":x: Beklenmeyen bir hata yüzünden bunu yapamadım!", ephemeral: true});
		}

	},
};