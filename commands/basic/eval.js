// Thank you: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md

const { Command } = require('discord-akairo');
const CONFIG = require("../../public-config.json");

class EvalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      split: 'none',
      ownerOnly: true,
      args: [
        {
          id: 'code',
          type: 'string'
        }
      ]
    });
  }

  // userPermissions(message) {
  //   let owners = CONFIG.owners;
  //   if(!owners.includes(message.author.id)) {
  //     message.reply("Just who do you think you are.");
  //     return false;
  //   }
  //   return true;
  // }

  exec(message, args) {
    let clean = text => {
      if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    };

    try {
      let code = args.code;
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
}

module.exports = EvalCommand;