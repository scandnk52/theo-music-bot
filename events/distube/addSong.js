module.exports = (client) => {

    client.distube.on("addSong", (queue, song) => {
        return queue.textChannel.send({content: `:notes: **${song.name}** başarıyla sıraya eklendi! ${song.user}`});
    });

}