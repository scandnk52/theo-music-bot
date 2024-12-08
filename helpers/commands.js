const { glob } = require("glob");

getCommands = async () => {
  return commandFiles = await glob(`${process.cwd()}/commands/**/*.js`);
}

module.exports =  async () => {

  const commandFiles = await getCommands();

  const commands = {};

  commandFiles.map((path) => {

    const category = path.slice(9, -3).split("\\")[0];

    const config = require(process.cwd()+"/"+path).config;

    (!commands[category]) ? commands[category] = [] : null;

    commands[category].push(config);

  });

  return commands;
    
};

module.exports.names = async () => {

  const commandFiles = await getCommands();

  const commands = [];

  commandFiles.map((path) => { 
    const category = path.slice(9, -3).split("\\")[1];
    commands.push("/"+category);
  });

  return commands;

}