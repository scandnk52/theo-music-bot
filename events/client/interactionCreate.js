const { Events } = require("discord.js");

module.exports = (client) => {

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: ':x: Komut çalıştırılırken beklenmedik bir hata oluştu!', ephemeral: true });
            } else {
                await interaction.reply({ content: ':x: Komut çalıştırılırken beklenmedik bir hata oluştu!', ephemeral: true });
            }
        }
    });

}