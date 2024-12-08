const { REST, Routes } = require("discord.js");
const { glob } = require("glob");

require("dotenv").config();

module.exports = () => {
    const getCommands = async () => {

        const commandFiles = await glob(`${process.cwd()}/commands/**/*.js`);
        let commands = [];
    
        commandFiles.forEach((path) => {
    
            const file = require(process.cwd()+"/"+path);
            try {
                commands.push(file.data.toJSON());
            } catch (e) {
                console.error(`HATA: ${path} konumundaki komut yüklenemedi!`);
            }
        });
    
        return commands;
    
    }
    
    const commands = getCommands();
    
    const rest = new REST().setToken(process.env.TOKEN);
    
    (async () => {
        try {
            
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT, process.env.GUILD),
                { body: await commands },
            );
    
            console.log(`${data.length} (/) uygulama komut bilgisi yüklendi.`);
        } catch (error) {
            console.error(error);
        }
    })();
}
