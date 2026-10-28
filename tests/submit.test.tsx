import { expect, test } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'

const drawEmptyBand = (on: Parameters<TestBody>[1]) =>
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)

    return <Box />
  })

const BAND = {
  plugin: 'submit-without-autoscroll',
  component: 'AbovePrompt',
  requestId: 'above-prompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

for (const surface of ['terminal', 'desktop'] as const) {
  test(`the button submits the draft as the person's own, on ${surface}`, async ($, on) => {
    drawEmptyBand(on)
    const submitted: unknown[] = []
    let draft = 'look at line 40'

    on('prompt.read', () => ({ value: { text: draft, cursor: draft.length } }))
    on('prompt.fill', (_, e) => {
      draft = e.text
      return { isFilled: true, box: { text: draft, cursor: draft.length } }
    })
    on('prompt.submit', (_, e) => {
      submitted.push(e)
      return { text: e.text }
    })

    const ui = await $.ui.mount({ ...BAND, surface })
    await ui.press({ key: 'submit' })

    expect(draft).toBe('')
    expect(submitted).toHaveLength(1)
    expect(submitted[0]).toMatchObject({ text: 'look at line 40', origin: { asUser: true } })
    await ui.unmount()
  })

  test(`an empty draft submits nothing, on ${surface}`, async ($, on) => {
    drawEmptyBand(on)
    const submitted: unknown[] = []

    on('prompt.read', () => ({ value: { text: '  ', cursor: 2 } }))
    on('prompt.submit', (_, e) => {
      submitted.push(e)
      return { text: e.text }
    })

    const ui = await $.ui.mount({ ...BAND, surface })
    await ui.press({ key: 'submit' })

    expect(submitted).toHaveLength(0)
    await ui.unmount()
  })
}
