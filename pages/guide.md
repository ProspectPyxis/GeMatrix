# Getting Started with Boardcord

At a first glance, Boardcord might seem like a complicated bot to set up and use. This guide should at least guide you on how to start and play a game from start to finish.

## Starting a game setup

Before starting a game, you'll have to set up the game first. To start a game setup, simply run the command `bc!setup [game]`, replacing [game] with the name of the game you wish to start (do NOT include brackets). For example. to start setting up a game of Connect Four, the command would be `bc!setup Connect Four`. For people who really want to do things quickly, something like `bc!setup connect4` does the same thing, but most people shouldn't have to worry about it.

You can see the list of available games [here](games.md).

## Setting up your game

After you have run the initial setup command, the bot should display a game setup message, showing details such as the game being played, the host of the game, the players in the game, etc. From here, as the host of the game, you can do a few things:

- Switch game access between private and public with the command `bc!setup access`. Games start off private by default. Anyone may join a public game by typing `bc!join`, while for private games, the host must directly invite other players. Speaking of...
- Invite players with the command `bc!setup invite [players]`, replacing [players] with mentioning whatever players you wish to invite to the game. Once a player has been invited, they must type "accept" (no prefix) to join the game within 30 seconds, or the invite will time out. Don't worry if this happens - you can simply resend the invite. You may invite multiple players at a time by mentioning multiple people in the message.
- Set game options with the command `bc!setup set [option] [value]`. If a game has options you can set, it'll be displayed on the setup message. You can then check the help page on the game linked in the message to see the options you can set, and what values you can set them to. Just replace [option] with the option you want to set, and [value] with the, well, value.
- Set the game variant with the command `bc!setup variant [variant]`. Certain games may have variants you can play which have different rulesets. If you wish to play one, simply run this command, replacing [variant] with the name of the variant you want to play. All variants for a game should be listed on the respective game's documentation.

Once everything has been set up, you can finally truly start the game by running the command `bc!setup start`. After a countdown, you're off to the races!

## Playing the game

Due to the varied nature of Boardcord, each game will obviously require different inputs to play. For the most part, you can get information on what you need to send to play the game on the game's documentation page (accessible by anyone in the game via the command `bc!game docs`). Note that for all inputs, you *should not put the bot prefix in front.* That is, if the game instructs you to send a letter, you should simply send "A", and NOT "bc!A".
