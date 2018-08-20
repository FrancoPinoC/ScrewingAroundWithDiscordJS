const { Command } = require('discord-akairo');

const waitLimit = 30000;    // awaitReaction time, in milliseconds

const theCode = [
  "up", "up", "down", "down", "left", "right", "left", "right", "b", "a", "default"
];

const codeMessage =
    `:dancer: 
:tada: :confetti_ball: :confetti_ball: :confetti_ball: :confetti_ball: :confetti_ball: 
:tada: :regional_indicator_w: :regional_indicator_o: :regional_indicator_o: :bangbang:  :bouquet:
:tada: :balloon: :balloon: :balloon: :balloon: :balloon:`
;

const sleep = require('../../utils').sleep;


// Maps action to graphic
const texts = {
  "starting": "Starting...",
  "default":"🙎",
  "left":"🙋",
  "up":"🙆",
  "down":"🙇",
  "right":"💁",
  "a": "💁✨",
  "b": "🤦",
  "exit": "🙍"
};

const loadingReact = "🔄";

// Maps action to controller emoji
const controller = {
  "default": "⏺",
  "left":"⬅",
  "up":"⬆",
  "down":"⬇",
  "right":"➡",
  "a": "🅰",
  "b": "🅱",
  "exit": "❌",
};

// Maps controller emoji to action
const inputMap = new Map([
    [controller.default, "default"],
    [controller.left, "left"],
    [controller.up, "up"],
    [controller.down, "down"],
    [controller.right, "right"],
    [controller.a, "a"],
    [controller.b, "b"],
    [controller.exit, "exit"],

]);


class ToyCommand extends Command {
  constructor() {
    super('toy', {
      aliases: ['toy', 'control', 'game'],
      args: [
        {
          id: 'solo',
          type: 'string',
        }
      ]
    });
  }

  filter(reaction, user) {
    let correctUser = (!this.client.game.singlePlayer)? true : user.id === this.client.game.player;
    return Object.values(controller).includes(reaction.emoji.name)
        && (this.client.game && this.client.game.loading === false)
        && user.id !== this.client.user.id   // Bot id
        && correctUser;
  };

  async setUp(message, args) {
    // You could also just associate games to message ids and let multiple games run
    let soloing = args.solo? args.solo==="solo" : false;
    let player = soloing? message.author.id : null;
    if(!this.client.game) {
      this.client.game = {
        on: true,
        loading: true,
        state: "default",
        sequenceStep: 0,
        singlePlayer: soloing,
        player: player
      }
    }
    else {
      return message.channel.send("Sorry! A game is already in progress");
    }
    // Construct the controller
    this.client.gameMess = await message.channel.send(texts.starting);
    let controllerEmojis = inputMap.keys();
    for(let conEmoji of controllerEmojis) {
      await this.client.gameMess.react(conEmoji);
    }
    this.client.gameMess = await this.client.gameMess.edit(texts.default);
    console.log("Ready!");
    this.client.game.loading = false;
  }

  async timeUp(collectedFailure) {
    console.log("Collected failure: \n");
    console.error(collectedFailure);
    console.log("- - - - - - - - - - - - - - - - - - -\n");
    // Find a way to check this is the reason it failed? (but it might not exist??)
    await this.client.gameMess.channel.send(`I've been waiting for over ${waitLimit/1000} seconds ;-;. Game over.`);
    console.log("Time up, game over");
    this.client.game.on = false;
  }

  async render() {
    try {
      this.client.gameMess = await this.client.gameMess.edit(texts[this.client.game.state]);
    } catch(e) {
      console.error(e);
    }
  }

  destroyGame() {
    this.client.game = undefined;
    this.client.gameMess = undefined;
    console.log("Game destroyed");
  }

  codeCheck() {
    if (this.client.game.state === theCode[this.client.game.sequenceStep]){
      this.client.game.sequenceStep += 1;
      console.log(`${this.client.game.sequenceStep} - ${controller[this.client.game.state]}`);
      if (this.client.game.sequenceStep === theCode.length) {return true;}
    }
    else {
      this.client.game.sequenceStep = 0;
    }
    return false;
  }

  // Go through all controller reactions and remove all extra reactions besides the bot's.
  // (what if for whatever reason one of the bot's reactions got removed?)
  // async clearAllReactions() {
  //
  // }

  async clearReactions(reaction) {
    let removePromises = [];
    reaction.users.forEach(function(user) {
      if(user.bot){return;}
      removePromises.push(reaction.remove(user));
    });
    return await Promise.all(removePromises);
  }

  async codeCompletedSequence() {
    // sleep because I like theatrics and suspense ┐(' - ' )┌
    await this.client.gameMess.clearReactions();
    await sleep(1500);
    await this.client.gameMess.edit(".");
    await sleep(700);
    await this.client.gameMess.edit(". .");
    await sleep(700);
    await this.client.gameMess.edit(". . .");
    await sleep(700);
    return await this.client.gameMess.channel.send(codeMessage);
  }

  async gameLoop() {
    let collectedReaction;
    let reaction;
    while(this.client.game.on) {
      try {
        collectedReaction = await this.client.gameMess.awaitReactions(this.filter, { max: 1, time: waitLimit, errors: ['time'] });
      } catch (collectedFailure) {
        await this.timeUp(collectedFailure);
        break;
      }
      this.client.game.loading = true;
      reaction = collectedReaction.first();
      // Process input:
      let action = inputMap.get(reaction.emoji.name);
      this.client.game.state = action;  // "state=action" kinda seems like weird wording, but whatever, it's my code >:C
      await this.render();
      if (action === "exit") {
        console.log("Ending game");
        this.client.game.on = false;
      }
      else if (this.codeCheck()) {
        let codeMess = await this.codeCompletedSequence();
        this.client.game.on = false;
      }
      else {
        await this.clearReactions(reaction);
      }
      this.client.game.loading = false;

    }
  }

  async exec(message, args) {
    await this.setUp(message, args);
    await this.gameLoop();
    this.destroyGame();
  }
}

module.exports = ToyCommand;