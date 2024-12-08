const commands = require('../helpers/commands.js');

module.exports = async (client, ActivityType) => {

    const activities = await commands.names();

    setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];

    client.user.setActivity({
        name: newActivity,
        type: ActivityType.Playing
    });
    }, 60_000);
}