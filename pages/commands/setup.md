# setup

Sets up a new game, or modifies the running setup instance. Note that *there can only be one game running per channel.*

### Alias(es)

- `setupgame`
- `newgame`

### Usage
```
setup <game> [/ variant]
setup <subcommand> <...>
```

## Parameters

### game

The name of the game to start. This could either use the full game name or any of its aliases. It's also case insensitive, so don't worry about capitalization.

If the game name is followed by a ` / ` (spaces included), what comes after the slash will automatically be set as the variant to run, if found.

### subcommand

If a setup is already running in the channel, you may pass a *subcommand* into the setup to set its various values. Unless stated otherwise, *only the host of the game may use subcommands.*

The possible subcommands are:

#### invite

Invites any mentioned users to the game. The invitee must then type "accept" within 30 seconds to join the game.

**Usage:**
```
setup invite <users...>
```

- **users...**

  User(s) to invite to the game.

#### option/set

Sets a game option, if there are any.

**Usage:**
```
setup option <option> <value>
```

- **option**

  The game option to set.

- **value**

  The value to set it to. Leave blank to reset the value to default.

#### turnorder/turns/turn

Sets the turn order, or toggle turn order randomization. Only applicable for games with a turn order.

**Usage:**
```
setup turnorder <turn> [player]
```

- **turn**

  The turn to set the player to. Will not work if turn randomization is on.

  There's a special case if this is equal to `random` or `randomized` - this will *toggle turn order randomization.* That is, disregarding the manually set turn order, the turns will be randomized at the start of the game, *after* completing setup. This is to ensure no player knows the turn order ahead of time.

- **player**

  The player to set the turn for. Doesn't do anything if `turn` is equal to `random` or `randomized`.

#### variant/variation

Sets the game to a variation, if it has any.

**Usage:**
```
setup variant <variant>
```

- **variant**

  The name of the variant. This could either use the full variant name or any of its aliases. If left blank, resets the game to the default variant.

#### resend

Simply resends the game setup message, in case other messages cover it up. This is a convenience function to reduce the amount of scrolling needed.

*You do not need to be host to use this subcommand!*

#### leave

Leaves the game.

*You* ***must not*** *be host to use this subcommand - if you want to cancel setup, please use the `cancel` subcommand instead.*

#### kick

Kicks a user from the game.

**Usage:**
```
setup kick <user>
```

- **kick**

  The user to kick from the game.

#### start

Starts the game.

#### cancel

Cancels the setup.

## Example(s)

- Starts a setup of Connect Four.
  ```
  setup connect 4
  ```

- Starts a setup of Tic-tac-toe, and set the variant to Dan's Variation
  ```
  setup tic tac toe / dans variation
  ```

- Invite User and User2 to the game
  ```
  setup invite @User#1234 @User2#5678
  ```

- Set the game option `turnLimit` for the game to 50
  ```
  setup option turnLimit 50
  ```
