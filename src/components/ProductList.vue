<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { FoodService } from '@/services/food.service'
import { createToastService } from '@/services/toast.service'
import SingleProduct from '@/components/SingleProduct.vue'

const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const visible = ref(false)

async function reqServer(func, params=[]) {
  try {
    return await func(...params)
  } catch (error) {
    handleError(error)
  }
}

function handleError(error) {
    toastService.alertError('Something went wrong', 'Please try again later')
    console.error('Error fetching data:', error)
}

const foodService = new FoodService()
let page = 1
const fetchMore = ref(true)
const products = ref([])
const query = ref('')

async function fetchProducts() {
  try {
    const data = await getUnfiltered()

    products.value = [...products.value, ...data]
  } catch (error) {
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

async function search() {
  const data = await getFiltered()
  products.value = [...products.value, ...data]
}

async function getFiltered() {
  const data = await foodService.search(query.value, page)
  page = data.page + 1
  if (data.to === data.total || data.foodItems.length === 0) {
    fetchMore.value = false
  }
  return data.foodItems
}

async function getUnfiltered() {
  const data = await foodService.index(page)

  page = data.page + 1

  if (data.to === data.total || data.foodItems.length === 0) {
    fetchMore.value = false
  }

  return data.foodItems
}

async function loadMore() {
  if (query.value.length > 2) {
    await reqServer(search)
  } else {
    await reqServer(fetchProducts)
  }
}

async function onInput() {
  page = 1
  let data = []

  if (query.value.length > 0) {
    data = await reqServer(getFiltered)
  } else if (query.value.length === 0) {
    data = await reqServer(getUnfiltered)
  }
  products.value = data
}


onMounted(async () => {
  await reqServer(fetchProducts)
})


</script>

<template>
    <Drawer v-model:visible="visible" position="right">
      <template #header>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="query" placeholder="Search" @input="onInput" />
        </IconField>
      </template>
      <Accordion value="0">
        <AccordionPanel v-for="product in products" :key="product.ean" :value="product.ean">
          <AccordionHeader>
            <div class="w-full text-left flex flex-row gap-4">
              <img v-if="product.img.sm" :src="product.img.sm" :alt="product.name"
                class="w-16 h-16 object-cover rounded-lg mb-2" />
              <div class="flex flex-col gap-1 w-full">
                <span class="text-left w-full font-semibold text-slate-600 capitalize text-sm">
                  {{ product.name }}, {{ product.brand ?? '' }}
                </span>
                <span class="text-left w-full text-slate-500 text-sm">
                  {{ product.kcal_100g }} kcal per 100g
                </span>
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <SingleProduct :ean="product.ean" @add-food="(data) => $emit('add-food', data)" />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <div class="flex justify-center">
        <Button label="Load more" @click="loadMore" text class="mt-1" />
      </div>
    </Drawer>
</template>
