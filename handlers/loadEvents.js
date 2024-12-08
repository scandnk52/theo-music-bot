const { glob } = require("glob");

module.exports = async (client) => {

    const eventFiles = await glob(`${process.cwd()}/events/**/*.js`);

    eventFiles.map((path) => {

        try {
            require(process.cwd()+"/"+path)(client);
        } catch (e) {
            console.error(`HATA: ${path} konumundaki event yüklenemedi!`);
        }

    });

};