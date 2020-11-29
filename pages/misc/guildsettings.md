# Per-Server Settings

This bot has a few settings that can be set differently per-server to change its behavior. Here's a list of the current settings available to change with the `set` command.

## prefix

The bot's prefix for this server. Note that you may get the bot's current prefix at any time by mentioning the bot.

**Default:** `gm!`

**Possible values:** Any string

## allowRedo

If set to `true`, allows the `setup redo` command to be used to start a new game with the same settings as the recently finished one.

**Default:** `true`

**Possible values:** `true` or `false`

## channelWhitelist

A list of channels where you can start new games in. If empty, all channels are allowed for starting new games.

Editing this value is a little different from others - you must use the command `set channelWhitelist add [channels...]` to add channels to the whitelist, or `set channelWhitelist remove [channels...]` to remove channels from the whitelist.

**Default:** *Empty*
