# set

Sets a server-specific setting.

For more details on each individual setting and how to set them, see [this](../misc/guildsettings.md) page.

*You must have the "Manage Server" permission to use this command!*

### Alias(es)

*None available.*

### Usage
```
set <option> <value>
```

## Parameters

### option

The name of the option to set. *Options are case sensitive!*

### value

The value to set the option to.

## Example(s)

- Disable the `setup redo` command for this server
  ```
  set allowRedo false
  ```

- Add the channel `#game` to the channel whitelist
  ```
  set channelWhitelist add #game
  ```
