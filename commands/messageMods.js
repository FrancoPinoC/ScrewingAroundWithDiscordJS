const { Command } = require('discord-akairo');
const CONFIG = require("../public-config.json");

class MessageMods extends Command {
  constructor() {
    super('messagemods', {
      aliases: ['messagemods', 'message-mods', 'modmail'],
      split: 'none',
      cooldown: 10000,
      ratelimit: 2,
      args: [
        {
          id: 'mail',
          type: 'string',
        }
      ]
    });
  }

  userPermissions(message) {
    let server = this.client.guilds.get(CONFIG.mainModServer);
    server.fetchMembers();
    let modRoles = CONFIG.modRoles;
    let serverMember = server.member(message.author);
    // No randos yo!   (... reminder this command can potentially be used from DMs)
    if (!serverMember) {
      message.reply("You can only send modmail if you are a member of the server you are mailing to.");
      return false;
    }
    // This command was originally for "oh shit, there's apparently no available mods" situations.
    for (let i = modRoles.length-1; i >=0; i--) {
      let roleId = modRoles[i];
      let modList = server.roles.get(roleId).members.array();
      for (let i = modList.length-1; i >= 0; i--) {
        let mod = modList[i];
        let modPresence = mod.presence.status;
        // TODO How about a CONFIG option to turn this check or on and off, plus a command that can do that.
        if (modPresence === 'online') {
          message.reply(
              "Modmail can only be used when there are no mods online."
          );
          return false;
        }
      }
    }
    let mutedRoles = CONFIG.mutedRoles;
    for (let i = mutedRoles.length-1; i>= 0; i--) {
      let mutedRole = mutedRoles[i];
      if (serverMember.roles.has(mutedRole)) {
        // If they are muted they don't even deserve an explanation tbh
        return false;
      }
    }
    // Discord has a kinda fucked up permisssions hierarchy so this kinda doesn't work as expected... b
    return serverMember.hasPermission("SEND_MESSAGES");
  }

  exec(message, args) {
    if (args.mail.trim() === "") {
      return message.reply("Ok, but you gotta send something.");
    }
    // public-config should have one main server and one main channel in that server to send mails to.
    let server = this.client.guilds.get(CONFIG.mainModServer);
    let modChannel = server.channels.get(CONFIG.mainModChannel);
    // Where did it come from Cotton Eye Joe?
    let origin = "";
    let sender = message.author;
    let messChannel = message.channel;
    switch (messChannel.type) {
      case "dm":
        origin = "a DM";
        break;
      case "group":
        origin = "a group DM";
        break;
      case "text":
        origin = messChannel;
    }
    let header = `***${sender} sent a message from ${origin}***`;
    let mail = args.mail;
    // First send a header with the message's info (so we can track down any spammy mofos)
    return modChannel.send(header)
        .then(() => {return modChannel.send(mail, {disableEveryone: true} ); })
        .then(() => {return message.reply("Your message has been sent!");})
        .catch(error => {
          console.log(error);
          return message.reply(
              "Something failed! Pls, inform a mod about this...\n" +
              "... I know I know, it's ironic, but contact one when one is available please."
          );
        })
  }
}


module.exports = MessageMods;