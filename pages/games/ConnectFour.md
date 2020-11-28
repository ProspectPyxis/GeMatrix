# Connect Four

The classic four-in-a-row game that, for some reason, has had the box art memed on.

**Alias(es):** `Four-in-a-row`

## Rules

- Start with a 6 high, 7 wide board
- Each player takes turns putting their tokens in each column
- First player to make at least four-in-a-row horizontally, vertically, or diagonally wins
- Game ends in a draw if the board is completely filled

## How to play

Type the number of the column you want to put your marker in.

If the `popout` option is enabled (see below), prefix the number with "pop " (space included) to pop a piece off the corresponding column.

## Game options

- **popout**

  If this is set to true, a new move is made available - you may say "pop [column]" to remove a piece from the bottom of the column, as long as that piece is yours. This also means that the game will *never* end in a draw, as you can always pop a piece even if the board is full.

  **Default:** `false`

  **Possible values:** Boolean (`true`/`on` or `false`/`off`)

## Variations

### 5-in-a-row

*It's not exactly Connect* ***Four*** *anymore, is it?*

This variant was listed on Wikipedia's page for Connect Four. It's unsourced and I couldn't find it via Googling, so I'm not sure if this is real, but it sounds interesting anyways.

**Alias(es):** *None available.*

#### Rules

- A column is added to the very left and right of the board, making it a 9 wide board
- The added columns are pre-filled with alternating markers and cannot be popped even if that rule is enabled
- Each player requires 5 in a row or more to win

#### How to play

It's played exactly the same as normal Connect Four.

#### Variant options

*No additional options are available for this variant.*
