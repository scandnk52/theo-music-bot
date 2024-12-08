const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

const config = {
    name: "ara",
    description: "Şarkıları aratmak için kullanılır.",
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
				.setDescription('Aramak istediğiniz şarkı')),
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
            const limit = 5;
            const tracks = await interaction.client.distube.search(music, {requestedBy: interaction.user, limit: limit});

            const components = [];
            const emojis = { 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣"};
    
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Arama Sonuçları")
                .setDescription(`Bu sorguda **${tracks.length}** şarkı buldum.`)
                .setThumbnail(interaction.guild.members.me.displayAvatarURL())
                .addFields(
                    tracks.map((track, i) => {
                        return {name: track.name, value: (i+1).toString()}
                    }))
                .setTimestamp()
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
            
            components.push({ type: 1, components: [] })
    
            for (let i = 0; i < tracks.length; i++) {
                components[0].components.push(new ButtonBuilder().setEmoji(emojis[i + 1]).setCustomId(i.toString()).setStyle('Primary'));
            }
            components.push({type: 1, components: [new ButtonBuilder().setLabel("İptal").setEmoji("✖").setCustomId("cancel").setStyle('Danger')]});
            
            (interaction.type == 2 ?
                interaction.editReply({
                  embeds: [embed],
                  components: components
                })
                : interaction.reply({
                  embeds: [embed],
                  components: components
            })).then(async msg => {
    
                const play = async (track) => {
                    try {
                        await interaction.client.distube.play(voiceChannel, track, { textChannel: interaction.channel, member: interaction.member, voiceChannel: voiceChannel});
                    } catch (e) {
                        return await interaction.reply({content: ":x: Beklenmeyen bir hata yüzünden bunu yapamadım!", ephemeral: true});
                    }
                } 
    
                if (interaction.type == 2) {
    
                    const reply = await interaction.fetchReply();
                    const filter = i => {
                        return i.message.id === reply.id && i.deferUpdate() && i.user.id === interaction.user.id;
                    };
    
                    interaction.channel.awaitMessageComponent({ filter, time: 120000, max: 1 })
                        .then(async button => {
    
                            if (button.customId === "cancel") {
                                return interaction.deleteReply();
                            } else {
                                interaction.deleteReply();
                                play(tracks[parseInt(button.customId)]);
                            }
    
                        }).catch(err => {
                            return interaction.editReply({content: ":stopwatch: Zamanında işlem yapmadığın için seçim iptal edildi!", embeds: [], components: []});
                        });
    
                } else {
    
                    const filter = i => {
                        return i.message.id === msg.id && i.deferUpdate() && i.user.id === interaction.author.id;
                    };
    
                    msg.awaitMessageComponent({ filter, time: 120000, max: 1 })
                        .then(async button => {
    
                            if (button.customId === "cancel") {
                                return msg.delete();
                            } else {
                                msg.delete();
                                play(tracks[parseInt(button.customId)]);
                            }
    
                        }).catch(err => {
                            return msg.edit({content: ":stopwatch: Zamanında işlem yapmadığın için seçim iptal edildi!", embeds: [], components: []});
                        });
    
                }
    
            });

        } catch (e) {
            if (e.errorCode === "NO_RESULT") {
                interaction.editReply({content: ":mag_right: Ne yazık ki herhangi bir şarkı bulamadım!", ephemeral: true});
            }
        }

	},
};