const { EmbedBuilder } = require('discord.js');
const { numberFormat } = require('humanize');

module.exports = (client) => {

    client.distube.on("playSong", (queue, song) => {

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields({ name: 'Yükleyici:', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true })
        .addFields({ name: 'Şarkıyı İsteyen:', value: `${song.user}`, inline: true })
        .addFields({ name: 'Ses Seviyesi:', value: `${queue.volume}%`, inline: true })
        .addFields({ name: 'Görüntülenme:', value: `${numberFormat(song.views)}`, inline: true })
        .addFields({ name: 'Toplam Süre:', value: `${song.formattedDuration}`, inline: true })
        .addFields({ name: 'Filtreler:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
        .setTimestamp()

        return queue.textChannel.send({embeds: [embed]});

    });

}