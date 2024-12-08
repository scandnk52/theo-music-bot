const { Events, ActivityType } = require('discord.js');
const setActivity = require('../../utils/activity.js');

module.exports = (client) => {
		
    client.once(Events.ClientReady, client => {
        console.log(`${client.user.tag} şu anda kullanıma hazır!`);
    });

    setActivity(client, ActivityType);

}