import { describe, it, expect, vi, afterEach, beforeEach, afterAll } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'

import DateChanger from '../home/DateChanger.vue'

describe('DateChanger', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(DateChanger, {
      global: {
        plugins: [PrimeVue],
        components: {
          Button
        },
      },
      props: {
        date: '2025-04-27'
      }
    })

    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should render the component with date 2025-04-27 and weekday Sunday', () => {
    const dateText = wrapper.find('#date')
    expect(dateText.text()).toBe('2025-04-27')

    const weekdayText = wrapper.find('#weekday')
    expect(weekdayText.text()).toBe('Sunday')
  })

  it('Date is Sunday 2025-04-27. Click on right button should change the date to Monday 2025-04-28 and emit update event', async () => {
    const rightBtn = wrapper.find('#next')
    await rightBtn.trigger('click')

    const updDate = wrapper.find('#date')
    expect(updDate.text()).toBe('2025-04-28')

    const updWeekday = wrapper.find('#weekday')
    expect(updWeekday.text()).toBe('Monday')

    // 'update' is the name of the event.
    // First [0] is the first emitted event (each emit has own place in the array).
    // Second [0] is the first argument of the emitted event.
    expect(wrapper.emitted()['update'][0][0]).toEqual('2025-04-28')
  })

  it('Date is Sunday 2025-04-27. Click on left button should change the date to the 2025-04-26 Saturday and emit update event', async () => {
    const leftBtn = wrapper.find('#prev')
    await leftBtn.trigger('click')

    const updDate = wrapper.find('#date')
    expect(updDate.text()).toBe('2025-04-26')

    const updWeekday = wrapper.find('#weekday')
    expect(updWeekday.text()).toBe('Saturday')

    expect(wrapper.emitted()['update'][0][0]).toEqual('2025-04-26')
  })
})