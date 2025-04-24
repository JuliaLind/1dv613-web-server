<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FoodService } from '@/services/food.service'
import { createToastService } from '@/services/toast.service'
import ProductBody from '@/components/ProductBody.vue'
import ProductHeader from '@/components/ProductHeader.vue'


const toast = useToast()
const toastService = createToastService(toast)

const visible = ref(false)

/**
 * Makes a request to the server and creates a toast message in case of an error.
 *
 * @param {function} func - The function to be executed
 * @param {Array} params - The parameters to be passed to the function 
 */
async function reqServer(func, params = []) {
  try {
    return await func(...params)
  } catch (error) {
    toastService.alertError('Something went wrong', error.message)
  }
}

const foodService = new FoodService()
let page = 1
const fetchMore = ref(true)
const products = ref([])
const query = ref('')

/**
 * Fetches unfiltered products from the server.
 */
async function fetchProducts() {
  const data = await getUnfiltered()

  products.value = [...products.value, ...data]
}

/**
 * Searches for products based on the query.
 */
async function search() {
  const data = await getFiltered()
  products.value = [...products.value, ...data]
}

/**
 * Fetches filtered products from the server.
 * If the page is the last page or there are no more
 * products, it sets fetchMore to false in order to hide
 * the load more button.
 */
async function getFiltered() {
  const data = await foodService.search(query.value, page)
  page = data.page + 1
  if (data.to === data.total || data.foodItems.length === 0) {
    fetchMore.value = false
  }
  return data.foodItems
}

/**
 * Fetches unfiltered products from the server.
 * If the page is the last page or there are no more
 * products, it sets fetchMore to false in order to hide
 * the load more button.
 */
async function getUnfiltered() {
  const data = await foodService.index(page)

  page = data.page + 1

  if (data.to === data.total || data.foodItems.length === 0) {
    fetchMore.value = false
  }

  return data.foodItems
}

/**
 * Loads more products based on the current query.
 * If there is a search query, it fetches filtered products.
 * Otherwise, it fetches unfiltered products.
 */
async function loadMore() {
  if (query.value.length > 0) {
    await reqServer(search)
  } else {
    await reqServer(fetchProducts)
  }
}

/**
 * Handles the input event and fetches products based on the query.
 * If the query is empty, it fetches all products.
 * If the query is not empty, it fetches filtered products. Whenever the input changes, the page is reset to 1.
 */
async function onInput() {
  page = 1

  if (query.value.length > 0) {
    products.value = await reqServer(getFiltered)
    return
  }
  products.value = await reqServer(getUnfiltered)
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
          <ProductHeader :name="product.name" :img="product.img?.sm" :brand="product.brand"
            :kcal_100g="product.kcal_100g" />
        </AccordionHeader>
        <AccordionContent>
          <!-- <ProductBody :food="product" @add-food="(data) => $emit('add-food', data)" /> -->
          <ProductBody :food="product" @add-food="(data) => $emit('add-food', data)" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <div class="flex justify-center">
      <Button label="Load more" @click="loadMore" text class="mt-1" />
    </div>
  </Drawer>
</template>
