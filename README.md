# submit-without-autoscroll

A Claude Code mod that sends your prompt without scrolling the transcript to
the bottom

In fullscreen mode, Enter always yanks the view back to the newest line. That's
annoying when you scrolled up to read an earlier answer and want to ask about
it while it's still on screen. With this mod, a chord of your choice sends the
draft and leaves the view where it is. I use Ctrl+Enter. Claude's reply
still arrives, and the "new messages (ctrl+End)" pill tells you when it has.

If the view is already at the bottom, it follows the reply as usual

## Install

Needs Claude Code 2.1.308 or later. At the Claude Code prompt:

```
/plugin install submit-without-autoscroll --marketplace someonewithpc/claude-mod-submit-without-autoscroll
```

Then bind a chord to it in `~/.claude/keybindings.json`. Mods can't add
keybinding actions of their own, so the mod listens on one of the engine's,
`app:cycleDiffBase`, which only does something while the diff panel is open.

```json
{
  "bindings": [
    { "context": "Global", "bindings": { "ctrl+enter": "app:cycleDiffBase" } },
    { "context": "Chat", "bindings": { "ctrl+enter": null } }
  ]
}
```

A single key with a modifier, like Ctrl+Enter, only reaches a mod when it's
bound in the `Global` context. A two-key chord such as `ctrl+x s` works in
`Chat` too. Ctrl+Enter is also Claude Code's default for `chat:sendNow` in
`Chat`, which would win over the global binding, so the second entry unbinds
it. To use a different action, set the mod's `action` option in `/config`.

### Ghostty

Ghostty binds Ctrl+Enter to `toggle_fullscreen` by default, so Claude Code
never sees it. Unbind it in Ghostty's config:

```
keybind = ctrl+enter=unbind
```

### Nix

The flake has a NixOS module and a home-manager module:

```nix
inputs.claude-mod-submit-without-autoscroll.url = "github:someonewithpc/claude-mod-submit-without-autoscroll";

# home-manager
imports = [ inputs.claude-mod-submit-without-autoscroll.homeManagerModules.default ];
programs.claude-mod-submit-without-autoscroll.enable = true;
```

Both add the mod's store path to `CLAUDE_CODE_PLUGIN_DIRS`. The NixOS module
sets a session variable, which reaches shells started after the next login.
The home-manager module merges it into the `env` block of
`~/.claude/settings.json`, which every session reads. Neither writes the
keybinding for you.

## How it works

Claude Code repins the transcript when a prompt you typed lands, wherever you
had scrolled. A prompt that a plugin submits only repins when the view was
already at the bottom. The mod draws a hidden button above the prompt, tied to
the keybinding action. Pressing the chord reads the draft, clears the box, and
submits the text as a plugin prompt marked as your own words.

That has a few side effects:

- The transcript labels the message "Prompt from the submit-without-autoscroll
  plugin". The model reads it as your message, with no plugin framing
- Claude Code doesn't expand pasted images or `@file` mentions in a plugin's
  prompt. Use Enter for those
- If you send mid-turn, the prompt waits for the turn to end. Enter would hand
  it to the running turn

## Development

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

## License

MIT
