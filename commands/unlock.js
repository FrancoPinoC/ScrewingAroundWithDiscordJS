const { Command } = require('discord-akairo');
const sleep = require('../utils').sleep;

class Unlock extends Command {
  constructor() {
    super('unlock', {
      aliases: ['unlock', 'opendoor', 'open-door', 'password'],
      split: 'none',
      args: [
        {
          id: 'pass',
          type: 'string',
        }
      ],
    });
  }

  // whatevs actually, I'll just do it all here so the reaction to a block stays in this file too
  // userPermissions(message) {
  //   return message.member.roles.exists(role => role.name === 'Moderator');
  // }

  // Whatever logic is necessary to get the unlockable role
  getUnlockableRole() {
    const SECRETS = require("../secrets.json");
    return SECRETS.unlockableRole;
  };

  // Whatever logic is necessary to check the password
  checkPassword(pass) {
    // Hash the password and then check against the hash for extra security :^), I, however, ain't doing that here.
    const SECRETS = require("../secrets.json");
    return SECRETS.channelPassword === pass;
  };

  // to check the person is in the appropriate server
  getRoleServer() {
    let SECRETS = require('../secrets.json');
    return this.client.guilds.get(SECRETS.unlockableRoleServer);
  }

  async exec(message, args) {
    // These checks could be in a separate function but eh...
    // or use channel restrictions, but again, that'd mean going for listeners to act on it and I wanna keep it all here
    if(message.channel.type === "text") {
      // Can't be bothered to use awaitMessages, but like, that'd be neat I guess.
      message.author.send("Please try the command again here in DMs, passwords are to give in private don't you know");
      return message.delete();
    }
    let server = this.getRoleServer();
    server.fetchMembers();
    let serverMember = server.member(message.author);
    if (!serverMember) {
      return message.reply("You aren't in the server with the unlockable role, so what's even the point you dumdum?");
    }

    if (!args.pass) {
      return message.reply("Ok, but the password isn't *nothing*, I can tell you that much.");
    }

    // Maybe a trim() it, but then again, spaces *are* characters one might use in a password
    if(this.checkPassword(args.pass.trimLeft())) {
      let unlocked = this.getUnlockableRole();
      await serverMember.addRole(unlocked);
      return message.reply(`Congratulations, you now have the super special secret role🎊🎊!`);
    }

    await message.reply("🎊🎊🎊");
    return message.reply("🎉 Sadly, that was incorrect, yay!")
  }

}


// fun
function doorDrawingClosed() {
  return `
\`\`\`
　　　　　＝＝＝＝＝＝＝＝＝＝＝＝＝　　
　　　　｜　＿＿＿＿＿＿＿＿＿＿　｜｜
　　　　｜｜｜／／／／｜　　　　｜｜｜
　　　　｜　ーーーーーーーーーー　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜＿＿＿＿＿＿＿＿＿＿＿＿｜｜
ーーーーーーーーーーーーーーーーー
\`\`\`
  `;
}

function doorDrawingClosedWithEyes() {
  return `
\`\`\`
　　　　　＝＝＝＝＝＝＝＝＝＝＝＝＝　　
　　　　｜　＿＿＿＿＿＿＿＿＿＿　｜｜
　　　　｜｜👁」👁　｜／／／／｜｜｜｜
　　　　｜　ーーーーーーーーーー　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜　　　　　　　　　　　　｜｜
　　　　｜＿＿＿＿＿＿＿＿＿＿＿＿｜｜
ーーーーーーーーーーーーーーーーー

   *Password please*
\`\`\`
  `;
}


function doorDrawingOpen() {
  return `
\`\`\`
　　　　ーーーーーーーーーーーーーー
　　／／｜　　　　　　　　　　　　　｜
　／／　｜　　　　　　　　　　　　　｜
／／　／｜　　　　　　　　　　　　　｜
｜｜／／｜　　　　　　　　　　　　　｜
｜｜／　｜　　　　　　　　　　　　　｜
｜｜　　｜　　　　　　　　　　　　　｜
｜｜　　｜　　　　　　　　　　　　　｜
｜｜　　｜　　　　　　　　　　　　　｜
｜｜　　｜　　　　　　　　　　　　　｜
｜｜　　／ーーーーーーーーーーーーー
｜｜　／
｜｜／
\`\`\`
  `;
}

// I ended up not using this, but maybe in the future.

module.exports = Unlock;
