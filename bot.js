const { AkairoClient } = require('discord-akairo');
// secrets not in the repo 'cause it has obvious "should be private info only" stuff
const SECRETS = require("./secrets.json");
// For all your conveniently modifiable configuration
const CONFIG = require("./public-config.json");

const client = new AkairoClient({
  ownerID: CONFIG.owners,
  prefix: CONFIG.prefix,
  commandDirectory: './commands/',
  listenerDirectory: './listeners/'
}, {
  disableEveryone: true
});


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log("Yo yo yo");
  console.log(
      `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
  );
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.login(SECRETS.token);