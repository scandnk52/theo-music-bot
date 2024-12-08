const { SlashCommandBuilder } = require('discord.js');
const format = require('format-duration');

const config = {
    name: "filtre",
    description: "Şarkılara filtre uygular.",
};

module.exports = {
    config: config,
	data: new SlashCommandBuilder()
		.setName(config.name)
		.setDescription(config.description)
        .addStringOption(option =>
            option.setName('türü')
                .setDescription('Filtre türü seçiniz.')
                .setRequired(true)
                .addChoices(
                    { name: '3D', value: '3d' },
                    { name: 'Bass Boost', value: 'bassboost' },
					{ name: 'Karaoke', value: 'karaoke' },
                    { name: 'Echo', value: 'echo' },
                    { name: 'Reverse', value: 'reverse' },
					{ name: 'Flanger', value: 'flanger' },
					{ name: 'Gate', value: 'gate' },
					{ name: 'Haas', value: 'haas' },
					{ name: 'Mcompand', value: 'mcompand' },
					{ name: 'Phaser', value: 'phaser' },
					{ name: 'Tremolo', value: 'tremolo' },
					{ name: 'Earwax', value: 'earwax' },
                    { name: 'Slowed', value: 'vaporwave' },
                    { name: 'Speed Up', value: 'nightcore' },
                    { name: 'Surround', value: 'surround' },
                    { name: 'Temizle', value: 'clear' },
                )),
	async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        const filter = interaction.options.getString("türü");
        const filtersName = {
            "3d": "3D",
            "bassboost": "Bass Boost",
            "echo": "Echo",
            "reverse": "Reverse",
            "vaporwave": "Slowed",
            "nightcore": "Speed Up",
			"karaoke": "Karaoke",
			"flanger": "Flanger",
			"gate": "Gate",
			"haas": "Haas",
			"mcompand": "Mcompand",
			"phaser": "Phaser",
			"tremolo": "Tremolo",
			"earwax": "Earwax",
            "surround": "Surround",
        };

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

        if (filter === "clear") {
            queue.filters.clear();
            return interaction.reply({content: ":broom: Bütün filtreler temizlendi!"});
        }

        const checkFilter = await queue.filters.has(filter);

        if (!checkFilter) {
            queue.filters.add(filter);
            return interaction.reply({content: `:loudspeaker: Şarkıya **${filtersName[filter]}** filtresi uygulandı!`});
        } else {
            queue.filters.remove(filter);
            return interaction.reply({content: `:loudspeaker: Şarkıdan **${filtersName[filter]}** filtresi kaldırıldı!`});
        }

	},
};