/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const shuffle = require('knuth-shuffle').knuthShuffle;
const utils = require('../common/utils.js');

class GameSetup {

    /**
     * @class
     * @param {Discord.Client} bot - The bot instance.
     * @param {Discord.Message} triggermsg - The message that created this GameSetup instance.
     * @param {Game} game - The game to setup.
     */
    constructor(bot, triggermsg, game) {

        this.bot = bot;
        this.msg = triggermsg;
        this.game = game;

        // Shorthands
        this.channel = triggermsg.channel;
        this.guild = triggermsg.guild;
        this.name = game.gameData.name;

        this.public = false;

        this.players = [triggermsg.author];
        this.gm = triggermsg.author;

        this.id = nanoid();
        this.options = game.gameData.defaultOptions;
        this.turnOrder = game.gameData.turnOrder ? [triggermsg.author] : null;
        this.randomTurns = false;
        this.variant;

    }

    setFromGame(game) {
        this.game = game.constructor;
        this.name = game.constructor.gameData.name;

        var toPlay = game.players.filter(element => element.id !== this.gm.id);
        this.players = this.players.concat(toPlay);
        if (game.constructor.gameData.turnOrder) this.turnOrder = this.players;
        if (game.constructor.gameData.isVariant) {
            this.variant = this.bot.gameVariants[this.game.name].find(e => e.matchName(this.bot, game.constructor.gameData.variantName, true));
        }
        this.options = game.options;
    }

    setVariant(variant) {
        if (this.bot.gameVariants[this.game.name].length === 0) return;

        var vIndex = this.bot.gameVariants[this.game.name].findIndex(element => element.matchName(this.bot, variant, true));

        if (vIndex !== -1)
        this.variant = this.bot.gameVariants[this.game.name][vIndex];
    }

    async init() {
        this.setupmsg = await this.channel.send(this.getSetupMessage());
        this.timer = setTimeout(() => {
            this.channel.send(`Setup for game "${this.game.gameData.name}" has timed out.`);
            this.abort();
        }, 120000);
    }

    /**
     * @returns {string} - The setup message string.
     */
    getSetupMessage() {
        let str = "";

        str += "**Setting up game:** " + this.name + "\n" + "**Host:** " + this.gm.tag + "\n";
        str += this.public ? "**Public game** - anyone can join" : "**Private game** - players must be invited";
        str += "\n--------------------\n";

        str += "**Players:**\n";
        str += this.players.join(" ");

        if (this.turnOrder) {
            str += "\n\n**Current turn order:**\n";
            if (this.randomTurns) str += "*Randomized!*";
            else str += this.turnOrder.join(", ");
        }

        if (this.bot.gameVariants[this.game.name] && this.bot.gameVariants[this.game.name].length > 0) {
            str += "\n\n**Variant selected:**\n";
            if (!this.variant) str += this.game.gameData.variantName;
            else str += this.variant.gameData.variantName;
        }

        if (Object.keys(this.options).length !== 0 || this.options.constructor !== Object) {
            str += "\n\n**Game Options:**\n";
            const readable = this.game.getReadableOptions(this.options);

            for (const k of readable) {
                str += `> ${k[0]} - *${k[1]}*\n`
            }
            str += `\n(You may see details on each game option at <https://prospectpyxis.github.io/GeMatrix/pages/games/${this.game.name}.html>)\n`;
        } else {
            str += "\n\nThis game has no options available.\n"
        }

        str += `\n*Once you are ready, run the command \`${this.bot.getPrefix(this.guild)}setup start\` to start the game.*`;
        str += `\n*To cancel this setup, run the command \`${this.bot.getPrefix(this.guild)}setup cancel\`.*`;
        str += `\n*Setup times out automatically 120 seconds after the last command.*`

        return str;
    }

    async interpretCommand(msg, args) {
        let cmd = args.shift();

        switch (cmd) {
            case 'access':
                this.public = !this.public;
                if (this.public) this.channel.send("The game is now **public** - anyone may join the game.");
                else this.channel.send("The game is now **private** - you must invite users to let them join.");
                this.setupmsg.edit(this.getSetupMessage());
                break;

            case 'invite':
                if (this.public) {
                    this.channel.send("The game is public - inviting people is unnecessary!");
                    break;
                }
                if (this.players.length === this.game.gameData.maxPlayers) {
                    this.channel.send(`You've already hit the player limit for this game! (Player limit: ${this.game.gameData.maxPlayers})`);
                    break;
                }
                if (this.players.length + msg.mentions.members.size > this.game.gameData.maxPlayers) {
                    this.channel.send(`You've invited too many players! (Player limit: ${this.game.gameData.maxPlayers})\nPlease invite less players.`);
                    break;
                }

                for (const i of msg.mentions.members.entries()) {
                    this.inviteUser(i[1].user);
                }
                this.channel.send('Users have been invited! The relevant user(s) must type "accept" to join the game within 30 seconds.');
                break;

            case 'join':
                if (!this.public) {
                    this.channel.send("The game is private - the host must invite you first!");
                    break;
                }
                if (this.players.length === this.game.gameData.maxPlayers) {
                    this.channel.send(`The player limit for this game has already been reached! (Player limit: ${this.game.gameData.maxPlayers})`);
                    break;
                }

                this.players.push(msg.author);
                if (this.turnOrder) this.turnOrder.push(msg.author);
                this.channel.send(`${msg.author} has joined the game!`);
                this.setupmsg.edit(this.getSetupMessage());

                break;

            case 'option':
            case 'set':
                if (
                    (this.variant && Object.keys(this.variant.gameData.defaultOptions).length === 0 && this.variant.gameData.defaultOptions === Object) ||
                    (!this.variant && Object.keys(this.game.gameData.defaultOptions).length === 0 && this.game.gameData.defaultOptions === Object)
                ) {
                    this.channel.send("No custom options are available for this game or variant!");
                    break;
                }
                if (!(args[0].toLowerCase() in this.options)) {
                    this.channel.send(`The game option \`${args[0]} was not found for this game!`);
                    break;
                }

                try {
                    var val = this.game.setOption(args[0].toLowerCase(), args.slice(1).join(' '), this.options);
                } catch (e) {
                    this.channel.send(e.message);
                }

                if (val === null) {
                    this.channel.send("There was an unknown error trying to set the option.");
                    break;
                }

                this.options[args[0].toLowerCase()] = val;
                this.channel.send(`Option \`${args[0]}\` has been set to: \`${val}\`.`);
                this.setupmsg.edit(this.getSetupMessage());
                break;

            case 'turnorder':
            case 'turns':
            case 'turn':
                if (!this.game.gameData.turnOrder) {
                    this.channel.send("This game does not have turn orders!");
                    break;
                }

                if (args[0] == "random") {
                    this.randomTurns = !this.randomTurns;
                    this.channel.send(`Random Turn Order has been toggled to: \`${this.randomTurns}\`.`);
                    this.setupmsg.edit(this.getSetupMessage());
                } else if (this.randomTurns) {
                    this.channel.send("Random turn order is currently on - please turn it off to enable manual turn setting.");
                    break;
                } else if (msg.mentions.members.size === 0) {
                    this.channel.send("You have not mentioned any player to change the position of!");
                    break;
                } else if (!this.turnOrder.find(element => element.id === user.id)) {
                    this.channel.send("The user could not be found in the players list! Have you invited them yet?");
                    break;
                } else {
                    // OPTIMIZE: There's probably a more efficient/cleaner way to do this?
                    var pos = parseInt(args[0]);
                    if (!pos || pos - 1 < 0 || pos - 1 > this.players.length) {
                        this.channel.send(`Position ${pos + 1} is undefined! Did you order your arguments correctly?`);
                        break;
                    }

                    var user = msg.mentions.members.first().user;
                    var temp = this.turnOrder.filter(element => element.id !== user.id);
                    temp.splice(pos - 1, 0, user); // Using pos - 1 here because arrays start at 0 and not 1
                    this.turnOrder = temp;
                    this.setupmsg.edit(this.getSetupMessage());
                }
                break;

            case 'variant':
                if (this.bot.gameVariants[this.game.name].length === 0) {
                    this.channel.send("This game has no variants available!");
                    break;
                }

                var vName = args.join(' ');

                // This being null indicates resetting to default variant
                var variantTo = null;

                var variantIndex = this.bot.gameVariants[this.game.name].findIndex(element => element.matchName(this.bot, vName, true))

                if (vName) {
                    if (!this.game.matchName(this.bot, vName, false) && variantIndex === -1) {
                        this.channel.send("The variant you input could not be found!");
                        break;
                    }
                    else variantTo = this.bot.gameVariants[this.game.name][variantIndex];
                }

                // This looks a bit weird but basically this compares the keys of the setup's options to the keys of the variant's options
                // This is true if the two keys match, otherwise this is false
                // This is basically to check if the options need to be reset when setting to a variant
                var compareOptions = this.utils.objectsHaveSameKeys(this.options, variantTo ? variantTo.gameData.defaultOptions : this.game.gameData.defaultOptions);

                if (!compareOptions) {
                    // Just skip all the checks if options are already empty anyways
                    if (Object.keys(this.options).length === 0 && this.options.constructor === Object) {
                        this.options = variantTo ? variantTo.gameData.defaultOptions : this.game.gameData.defaultOptions;
                    } else {
                        await this.channel.send(`**Warning:** The variant \`${variantTo ? variantTo.gameData.variantName : this.game.gameData.variantName}\`'s options do not match the current variant's options. Changing the variation will cause game options to reset!\nPlease type "confirm" within 10 seconds to confirm this change, or "cancel" to abort this operation.`)
                        try {
                            var confirmation = await msg.channel.awaitMessages(response => (
                                response.author.id == msg.author.id &&
                                (response.content.toLowerCase() == "confirm" || response.content.toLowerCase() == "cancel")
                            ), {
                                max: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (e) {
                            confirmation = "timeout";
                        }

                        if (confirmation === "timeout") {
                            this.channel.send("Operation has timed out.");
                            break;
                        }
                        else if (confirmation.first().content.toLowerCase() == "cancel") {
                            this.channel.send("Variant setting has been cancelled.");
                            break;
                        }
                        else {
                            this.options = variantTo ? variantTo.gameData.defaultOptions : this.game.gameData.defaultOptions;
                        }
                    }
                }

                this.variant = variantTo;
                this.channel.send(`The game variant has been set to: **${this.variant ? this.variant.gameData.variantName : this.game.gameData.variantName}**.`);
                this.setupmsg.edit(this.getSetupMessage());

                break;

            case 'resend':
                this.setupmsg.delete();
                this.setupmsg = await this.channel.send(this.getSetupMessage());
                break;

            case 'leave':
                this.players = this.players.filter(e => e.id == msg.author.id);
                if (this.turnOrder) this.turnOrder = this.turnOrder.filter(e => e.id == msg.author.id);
                this.setupmsg.edit(this.getSetupMessage());
                this.channel.send(`${msg.author} has left the game.`);
                break;

            case 'kick':
                var toKick = msg.mentions.members.first().user;
                if (!this.players.some(e => e.id == toKick.id)) {
                    this.channel.send(`Player **${toKick.tag}** is not in this game!`);
                    break;
                }

                this.players = this.players.filter(e => e.id == toKick.id);
                if (this.turnOrder) this.turnOrder = this.turnOrder.filter(e => e.id == toKick.id);
                this.channel.send(`Player **${toKick.tag} has been kicked from the game.`);
                this.setupmsg.edit(this.getSetupMessage());
                break;

            case 'start':
                if (this.players.length < this.game.gameData.minPlayers) {
                    this.channel.send(`This game does not have enough players to start yet! ${this.game.gameData.minPlayers - this.players.length} more player(s) needed.`);
                    break;
                }
                clearTimeout(this.timer);
                if (!this.variant)
                    this.bot.activeGames[this.guild.id][this.channel.id] = new this.game(
                        this.id,
                        this.bot,
                        this.channel,
                        this.turnOrder ? (this.randomTurns && shuffle(this.turnOrder)) || this.turnOrder : this.players,
                        this.options);
                else
                    this.bot.activeGames[this.guild.id][this.channel.id] = new this.variant(
                        this.id,
                        this.bot,
                        this.channel,
                        this.turnOrder ? (this.randomTurns && shuffle(this.turnOrder)) || this.turnOrder : this.players,
                        this.options);
                this.bot.activeGames[this.guild.id][this.channel.id].init();
                return;

            case 'cancel':
                clearTimeout(this.timer);
                this.channel.send(`Setup for game "${this.game.gameData.name}" has been aborted.`);
                this.abort();
                return;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.channel.send(`Setup for game "${this.game.gameData.name}" has timed out.`);
            this.abort();
        }, 120000);
    }

    /**
     * @param {Discord.User} user - The user to invite to the game.
     */
    inviteUser(user) {
        this.msg.channel.awaitMessages(response => response.author.id === user.id && response.content.toLowerCase() === "accept", {
                max: 1,
                time: 30000,
                errors: ['time'],
            })
            .then((collected) => {
                this.msg.channel.send(`${user} Invite accepted!`);
                this.players.push(user);
                if (this.turnOrder) this.turnOrder.push(user);
                this.setupmsg.edit(this.getSetupMessage());
            })
            .catch(() => {
                this.msg.channel.send(`Invite for user **${user.tag}** has timed out.`);
            });
    }

    abort() {
        delete this.bot.activeGames[this.guild.id][this.channel.id];
        if (Object.keys(this.bot.activeGames[this.guild.id]).length === 0 && this.bot.activeGames.constructor === Object)
            delete this.bot.activeGames[this.guild.id];
    }

}

module.exports = GameSetup;
