<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FoodService } from '@/services/food.service'
import { createToastService } from '@/services/toast.service'
import ProductBody from '@/components/home/shared/ProductBody.vue'
import ProductHeader from '@/components/home/shared/ProductHeader.vue'
import { FoodList } from '@/models/FoodList.js'
import { tryCatch } from '@/helpers/helpers'
import MissingItem from '@/components/home/productlist/MissingItem.vue'


const toast = useToast()
const toastService = createToastService(toast)
const visible = ref(false)
const foodList = new FoodList()

const handleError = (error) => {
  toastService.alertError('Something went wrong', error.message)
}


const foodService = new FoodService()
let page = 1
const fetchMore = ref(true)
const query = ref('')

/**
 * Fetches unfiltered products from the server.
 */
async function fetchProducts() {
  const data = await getUnfiltered()

  foodList.addItems(data)
}

/**
 * Searches for products based on the query.
 */
async function search() {
  foodList.addItems(await getFiltered())
}

/**
 * Fetches filtered products from the server.
 * If the page is the last page or there are no more
 * products, it sets fetchMore to false in order to hide
 * the load more button.
 *
 * @returns {Promise<Array>} - array of food items
 */
async function getFiltered() {
  const data = await foodService.search(query.value, page)
  page = data.page + 1
  hasMore(data)
  return data.foodItems
}

/**
 * Checks if there are more products to load.
 *
 * @param {object} data - associative array returned from the server 
 */
function hasMore(data) {
  if (data.total > data.to) {
    fetchMore.value = true
    return
  }
  fetchMore.value = false
}

/**
 * Fetches unfiltered products from the server.
 * If the page is the last page or there are no more
 * products, it sets fetchMore to false in order to hide
 * the load more button.
 *
 * @returns {Promise<Array>} - array of food items
 */
async function getUnfiltered() {
  const data = await foodService.index(page)

  page = data.page + 1

  hasMore(data)

  return data.foodItems
}

/**
 * Loads more products based on the current query.
 * If there is a search query, it fetches filtered products.
 * Otherwise, it fetches unfiltered products.
 */
async function loadMore() {
  if (query.value.length > 0) {
    await tryCatch(search, handleError)
  } else {
    await tryCatch(fetchProducts, handleError)
  }
}

/**
 * Handles the input event and fetches products based on the query.
 * If the query is empty, it fetches all products.
 * If the query is not empty, it fetches filtered products. Whenever the input changes, the page is reset to 1.
 */
async function onInput() {
  page = 1
  let data

  if (query.value.length > 0) {
    data = await tryCatch(getFiltered, handleError)
  } else {
    data = await tryCatch(getUnfiltered, handleError)
  }
  foodList.setItems(data)
}


onMounted(async () => {
  await tryCatch(fetchProducts, handleError)
})


</script>

<template>
  <Drawer v-model:visible="visible" id="product-list" position="right" :showCloseIcon="false">
    <template #header>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="query" placeholder="Search" @input="onInput" id="search-input" />
      </IconField>
      <Button label="Done" class="p-drawer-close-button" @click="$emit('close')" text />
    </template>
    <Accordion value="0">
      <AccordionPanel v-for="product in foodList.items.value" :key="product.ean" :value="product.ean"
        class="productlist-item" :id="'product-' + product.ean">
        <AccordionHeader>
          <ProductHeader :name="product.name" :img="product.imgUrl" :brand="product.brand" :kcal="product.kcal_100g"
            :weight="product.weight" />
        </AccordionHeader>
        <AccordionContent>
          <ProductBody :food="product" @done="(data) => $emit('add-food', data)" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <footer>
      <Button v-show="fetchMore" label="Load more" @click="loadMore" text class="mt-1" />
      <MissingItem v-show="!fetchMore" @new-product="(data) => foodList.addItems([data])" />
    </footer>
  </Drawer>
</template>

<style>
#product-list {
  width: 21rem;
}

#product-list .p-drawer-header {
  width: fit-content;
  padding: 0.5rem !important;
  gap: 0;
}

#product-list .p-drawer-content {
  padding-left: 0.5rem;
}

</style>

<style scoped>
footer {
  display: flex;
  justify-content: center;
}



.p-accordionheader {
  padding: 1rem 0.5rem 0.5rem;
}

</style>
