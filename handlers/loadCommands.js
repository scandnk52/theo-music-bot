const { glob } = require("glob");

module.exports = async (client) => {

    const commandFiles = await glob(`${process.cwd()}/commands/**/*.js`);

    commandFiles.map((path) => {

        const file = require(process.cwd()+"/"+path);

        try {
            client.commands.set(file.config.name, file);
        } catch (e) {
            console.error(`HATA: ${path} konumundaki komut yüklenemedi!`);
        }

    });

};