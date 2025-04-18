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
    options: {
      darkModeSelector: false || 'none',
    }
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

app.use(ToastService)

app.use(createPinia())
app.use(router)

app.mount('#app')
