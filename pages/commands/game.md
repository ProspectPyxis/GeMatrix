# game

Manages the running game instance. Any player involved in the game running in the channel may use this command.

### Alias(es)

*None available.*

### Usage
```
game <subcommand>
```

## Parameters

### subcommand

The subcommand to pass to the running game instance.

#### abort

Submits an abort vote to the game. *The running game instance will abort if half of the players in the game (rounded up) submits an abort vote.

If you've already submitted an abort vote, revokes your vote.

#### resend

Resends the game and log messages, in case other messages cover it up. This is a convenience function to reduce the amount of scrolling needed.
