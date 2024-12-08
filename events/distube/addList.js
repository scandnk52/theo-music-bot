module.exports = (client) => {

    client.distube.on("addList", (queue, playlist) => {
        return queue.textChannel.send({content: `:notepad_spiral: **${playlist.name}** adlı oynatma listesi sıraya eklendi! ${playlist.user}`});
    });

}