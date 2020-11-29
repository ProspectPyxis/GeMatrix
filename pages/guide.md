# Getting Started with GeMatrix

At a first glance, GeMatrix might seem like a complicated bot to set up and use. This guide should at least guide you on how to start and play a game from start to finish.

## Starting a game setup

Before starting a game, you'll have to set up the game first. To start a game setup, simply run the command `gm!setup [game]`, replacing [game] with the name of the game you wish to start (do NOT include brackets). For example. to start setting up a game of Connect Four, the command would be `gm!setup Connect Four`. For people who really want to do things quickly, something like `gm!setup connect4` does the same thing, but most people shouldn't have to worry about it.

You can see the list of available games [here](games.md).

## Setting up your game

After you have run the initial setup command, the bot should display a game setup message, showing details such as the game being played, the host of the game, the players in the game, etc. From here, as the host of the game, you can do a few things:

- Switch game access between private and public with the command `gm!setup access`. Games start off private by default. Anyone may join a public game by typing `gm!join`, while for private games, the host must directly invite other players. Speaking of...
- Invite players with the command `gm!setup invite [players]`, replacing [players] with mentioning whatever players you wish to invite to the game. Once a player has been invited, they must type "accept" (no prefix) to join the game within 30 seconds, or the invite will time out. Don't worry if this happens - you can simply resend the invite. You may invite multiple players at a time by mentioning multiple people in the message. *Note that this command won't work if the game is public - the players can simply join the game by themselves.*
- Set game options with the command `gm!setup set [option] [value]`. If a game has options you can set, it'll be displayed on the setup message. You can then check the help page on the game linked in the message to see the options you can set, and what values you can set them to. Just replace [option] with the option you want to set, and [value] with the, well, value.
- For games with a turn order, set the turn order with the command `gm!setup turns [turn number] [player]`, replacing turn number with the turn you wish to set the player to, and player with, well, the player you want to set the turn for. There's a special case for this: using the command `gm!setup turns random` will toggle *randomization* of the turn order, basically meaning that the turn order is shuffled automatically after you start the game, so no one can know ahead of time who's going first.
- Set the game variant with the command `gm!setup variant [variant]`. Certain games may have variants you can play which have different rulesets. If you wish to play one, simply run this command, replacing [variant] with the name of the variant you want to play. All variants for a game should be listed on the respective game's documentation.

Once everything has been set up, you can finally truly start the game by running the command `gm!setup start`. After a countdown, you're off to the races!

## Playing the game

Due to the varied nature of GeMatrix, each game will obviously require different inputs to play. For the most part, you can get information on what you need to send to play the game on the game's documentation page (accessible by anyone in the game via the command `gm!game docs`). Note that for all inputs, you *should not put the bot prefix in front.* That is, if the game instructs you to send a letter, you should simply send "A", and NOT "gm!A".

## Ending the game

Games should end automatically once someone has won or a draw has been declared. However, if you want to end the game early, you may *submit an abort vote* by using the command `gm!game abort`. This will pass an abort vote to the game. Once half of all players in the game (rounded up) has submitted an abort vote, the game will automatically end with no winner. You can also run the command a second time to retract your abort vote.

There's a special case for two player games - *both players* must submit an abort vote to end the game. This is to prevent one player from simply aborting the game once they're losing.
