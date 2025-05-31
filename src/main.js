import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { primary } from './config/colors'
import Fluid from 'primevue/fluid'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import router from './router'
import Button from "primevue/button"
import Password from 'primevue/password'
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ToastService from 'primevue/toastservice'
import Select from 'primevue/select'
import Drawer from 'primevue/drawer'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import OverlayPanel from 'primevue/overlaypanel'

import KeyFilter from 'primevue/keyfilter'






// import RadioButton from 'primevue/radiobutton'


const app = createApp(App)


const cyan = definePreset(Aura, {
  semantic: {
    primary: primary
  }
})


app.use(PrimeVue, {
  theme: {
    preset: cyan
  }
})

app.component('Button', Button)
app.component('Password', Password)
app.component('FloatLabel', FloatLabel)
app.component('Form', Form)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Select', Select)
app.component('Drawer', Drawer)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)

app.component('IconField', IconField)
app.component('InputIcon', InputIcon)


app.component('OverlayPanel', OverlayPanel)
app.component('Fluid', Fluid)

app.component('ConfirmPopup', ConfirmPopup)
app.use(ConfirmationService)

// block keys in inputfields based on pattern
app.directive('keyfilter', KeyFilter)


app.use(ToastService)

app.use(createPinia())
app.use(router)

app.mount('#app')
