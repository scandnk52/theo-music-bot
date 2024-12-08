const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const config = {
    name: "sıra",
    description: "Şarkıların sırasını gösterir.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
        .addIntegerOption(option => 
            option.setName('sayfa')
            .setDescription('Seçtiğiniz sayfayı listeler.')
            .setRequired(true)
            .setMinValue(1)),
	async execute(interaction) {

		const voiceChannel = interaction.member.voice.channel;
        const page = interaction.options.getInteger("sayfa");

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

        const limit = 5;
        const totalPage = Math.ceil(queue.songs.length / limit);

        if (page > totalPage) {
            return interaction.reply({content: `:x: Şu anda en fazla ${totalPage} sayfa var!`, ephemeral: true});
        }

        const tracks = queue.songs.slice((page - 1) * limit, ((page - 1) * limit) + limit);

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Sıralama Sonuçları")
        .setDescription(`**${page}** / **${totalPage}** Sayfa`)
        .setThumbnail(interaction.guild.members.me.displayAvatarURL())
        .addFields(
            tracks.map((track, i) => {
                return {name: track.name, value: (((page - 1) * limit)+i+1).toString()}
            })
        )
        .setTimestamp();

        return interaction.reply({embeds: [embed]});

	},
};