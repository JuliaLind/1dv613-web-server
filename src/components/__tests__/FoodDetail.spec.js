import { describe, it, expect, vi, afterEach, beforeEach, afterAll, beforeAll } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import FoodDetail from '../FoodDetail.vue'

describe('FoodDetail', () => {
  let wrapper
  const ean = '1234567890123'

  // mock matchMedia (likely used by Primevue)
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })


  beforeEach(async () => {
    wrapper = mount(FoodDetail, {
      global: {
        plugins: [PrimeVue],
        components: {
          Button,
          InputNumber,
          Select,
          DataTable,
          Column
        },
      },
      props: {
        info: {
          ean,
          name: 'Pizza',
          brand: 'Garant',
          weight: 70,
          kcal_100g: 250,
          macros_100g: {
            protein: 10,
            fat: 5,
            saturatedFat: 2,
            sugar: 10,
            fiber: 3,
            salt: 1,
            carbohydrates: 30
          },
          unit: 'g',
        }
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

  it('should render the component with correct food details', () => {
    const th1 = wrapper.find('th:first-of-type')
    expect(th1.text()).toBe('Nutrient')

    const th2 = wrapper.find('th:nth-of-type(2)')
    expect(th2.text()).toBe('Value')

    const tbody = wrapper.find('tbody')

    const tr0 = tbody.find('tr:nth-of-type(1)')
    expect(tr0.text()).toContain('kcal')
    expect(tr0.text()).toContain(Math.round(250 / 100 * 70))

    const tr1 = tbody.find('tr:nth-of-type(2)')
    expect(tr1.text()).toContain('protein')
    expect(tr1.text()).toContain(Math.round(10 / 100 * 70))

    const tr2 = tbody.find('tr:nth-of-type(3)')
    expect(tr2.text()).toContain('fat')
    expect(tr2.text()).toContain(Math.round(5 / 100 * 70))

    const tr3 = tbody.find('tr:nth-of-type(4)')
    expect(tr3.text()).toContain('saturated fat')
    expect(tr3.text()).toContain(Math.round(2 / 100 * 70))

    const tr4 = tbody.find('tr:nth-of-type(5)')
    expect(tr4.text()).toContain('sugar')
    expect(tr4.text()).toContain(Math.round(10 / 100 * 70))

    const tr5 = tbody.find('tr:nth-of-type(6)')
    expect(tr5.text()).toContain('fiber')
    expect(tr5.text()).toContain(Math.round(3 / 100 * 70))

    const tr6 = tbody.find('tr:nth-of-type(7)')
    expect(tr6.text()).toContain('salt')
    expect(tr6.text()).toContain(Math.round(1 / 100 * 70))

    const tr7 = tbody.find('tr:nth-of-type(8)')
    expect(tr7.text()).toContain('carbohydrates')
    expect(tr7.text()).toContain(Math.round(30 / 100 * 70))

    const weightInput = wrapper.findComponent({ name: 'InputNumber' })
    expect(weightInput.props('modelValue')).toBe(70)


    const unitSelect = wrapper.findComponent({ name: 'Select' })
    expect(unitSelect.props('options')).toEqual([
      { code: 'g', name: 'g' },
    ])
    expect(unitSelect.props('modelValue')).toEqual('g')
  })

  it('should update all food details when weight is updated', async () => {
    let weightInput = wrapper.findComponent({ name: 'InputNumber' })

    await weightInput.setValue(30)

    const tbody = wrapper.find('tbody')

    const tr0 = tbody.find('tr:nth-of-type(1)')
    expect(tr0.text()).toContain('kcal')
    expect(tr0.text()).toContain(Math.round(250 / 100 * 30))

    const tr1 = tbody.find('tr:nth-of-type(2)')
    expect(tr1.text()).toContain('protein')
    expect(tr1.text()).toContain(Math.round(10 / 100 * 30))

    const tr2 = tbody.find('tr:nth-of-type(3)')
    expect(tr2.text()).toContain('fat')
    expect(tr2.text()).toContain(Math.round(5 / 100 * 30))

    const tr3 = tbody.find('tr:nth-of-type(4)')
    expect(tr3.text()).toContain('saturated fat')
    expect(tr3.text()).toContain(Math.round(2 / 100 * 30))

    const tr4 = tbody.find('tr:nth-of-type(5)')
    expect(tr4.text()).toContain('sugar')
    expect(tr4.text()).toContain(Math.round(10 / 100 * 30))

    const tr5 = tbody.find('tr:nth-of-type(6)')
    expect(tr5.text()).toContain('fiber')
    expect(tr5.text()).toContain(Math.round(3 / 100 * 30))

    const tr6 = tbody.find('tr:nth-of-type(7)')
    expect(tr6.text()).toContain('salt')
    expect(tr6.text()).toContain(Math.round(1 / 100 * 30))

    const tr7 = tbody.find('tr:nth-of-type(8)')
    expect(tr7.text()).toContain('carbohydrates')
    expect(tr7.text()).toContain(Math.round(30 / 100 * 30))

    // should not emit done before pressing button is clicked
    expect(wrapper.emitted()).not.toHaveProperty('done')
  })

  it('should emit update event when weight is updated and button is pressed', async () => {
    const weightInput = wrapper.findComponent({ name: 'InputNumber' })
    await weightInput.setValue(30)

    const btn = wrapper.find('button')
    await btn.trigger('click')

    expect(wrapper.emitted()['done'][0][0]).toEqual({
      name: 'Pizza',
      brand: 'Garant',
      ean,
      weight: 30,
      unit: 'g',
      kcal_100g: 250,
      macros_100g: {
        protein: 10,
        fat: 5,
        saturatedFat: 2,
        sugar: 10,
        fiber: 3,
        salt: 1,
        carbohydrates: 30
      },
    })
  })
})