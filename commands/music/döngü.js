const { SlashCommandBuilder } = require('discord.js');

const config = {
    name: "döngü",
    description: "Müziği döngüye almak için kullanılır.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
        .addStringOption(option =>
            option.setName('mod')
                .setDescription('Döngünün modunu seçmek için kullanılır.')
                .setRequired(true)
                .addChoices(
                    { name: 'Tek', value: 'tek' },
                    { name: 'Tümü', value: 'tümü' },
                    { name: 'Kapat', value: 'kapat'}
                )),
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

        const mod = interaction.options.getString("mod");

        if (mod == 'tek') {
            queue.repeatMode = 1;
            return interaction.reply({content: ":arrows_counterclockwise: Şarkı döngüye alındı!"});
        } else if (mod = 'tümü') {
            queue.repeatMode = 2;
            return interaction.reply({content: ":arrows_clockwise: Listedeki tüm şarkılar döngüye alındı!"});
        } else {
            queue.repeatMode = 0;
            return interaction.reply({content: ":fast_forward: Döngü modundan çıkıldı!"});
        }

	},
};