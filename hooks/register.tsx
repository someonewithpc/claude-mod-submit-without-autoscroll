import type { EngineInterface, Register } from 'claude-code'

// Claude Code pins the transcript back to the bottom when a typed prompt
// lands, even if you scrolled up to read. A prompt a plugin submits only does
// that when the view was already at the bottom, so this submits the draft as
// one, in your own words.
const submit = async ($: EngineInterface) => {
  const { text } = await $.prompt.read()
  if (text.trim() === '') return

  const cleared = await $.prompt.fill({ text: '' })
  if (!cleared.isFilled) return

  void $.prompt.submit({ text, asUser: true })
}

export const register: Register = (on, options) => {
  const action = String(options.action ?? 'app:cycleDiffBase')

  // Buttons only answer a chord while drawn, so the band always holds one,
  // hidden, after whatever the plugins beneath draw.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const beneath = await next(e)
    if (e.props.hasSurvey) return beneath

    const { Box, Button } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        {beneath}
        <Box display="none">
          <Button key="submit" label="Submit here" action={action} onPress={() => submit($)} />
        </Box>
      </Box>
    )
  })
}
