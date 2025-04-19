import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'

import Button from "primevue/button"
import Password from 'primevue/password'
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { DatePicker } from 'primevue'
import ToastService from 'primevue/toastservice'
import Select from 'primevue/select'
import Drawer from 'primevue/drawer'

import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'


import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Row from 'primevue/row'


import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'




const app = createApp(App)


const cyan = definePreset(Aura, {
  semantic: {
    primary: {
        50: '{cyan.50}',
        100: '{cyan.100}',
        200: '{cyan.200}',
        300: '{cyan.300}',
        400: '{cyan.400}',
        500: '{cyan.500}',
        600: '{cyan.600}',
        700: '{cyan.700}',
        800: '{cyan.800}',
        900: '{cyan.900}',
        950: '{cyan.950}'
    }
  }
})


app.use(PrimeVue, {
  theme: {
    preset: cyan,
    // options: {
    //   darkModeSelector: false || 'none',
    // }
  }
})

app.component('Button', Button)
app.component('Password', Password)
app.component('FloatLabel', FloatLabel)
app.component('Form', Form)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('DatePicker', DatePicker)
app.component('Select', Select)
app.component('Drawer', Drawer)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Row', Row)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)

app.use(ToastService)

app.use(createPinia())
app.use(router)

app.mount('#app')
