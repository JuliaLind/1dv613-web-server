<script setup>
import { ref, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service.js'
import { isFilled } from '@/helpers/validate'
import { handleError, resizeImage } from '@/helpers/helpers'
import { FoodService } from '@/services/food.service'

const toast = useToast()
const toastService = createToastService(toast)
const foodService = new FoodService()

const image = ref(null)
const imagePreview = ref(null)
const image500 = ref(null)
const image100 = ref(null)

const fileInput = ref(null)

/**
 * Returns the default values for the product form.
 *
 * @returns {object} The default values for the product form.
 */
function getDefaultValues() {
  return {
    ean: '',
    name: '',
    brand: '',
    kcal_100g: 0,
    macros_100g: {
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      salt: 0,
      fiber: 0
    }
  }
}

const emit = defineEmits(['new-product', 'close'])
const form = ref(getDefaultValues())

/**
 * Handles the change event from the file input, by resizing and saving the image.
 *
 * @param {Event} event The change event from the file input.
 */
async function handleImage(event) {
  const file = event.target.files[0]
  if (!file) return

  image.value = file
  const lgImage = await resizeImage(file, 500)
  const smImage = await resizeImage(file, 100)

  imagePreview.value = lgImage
  image500.value = lgImage
  image100.value = smImage
}

/**
 * Clears the image preview and reclicks the file input to allow re-selection.
 */
async function retake() {
  resetImage()

  await nextTick()

  if (fileInput.value) {
    fileInput.value.click()
  }
}

/**
 * Resets the image and its preview.
 */
function resetImage() {
  image.value = null
  imagePreview.value = null
  image500.value = null
  image100.value = null
}

/**
 * Validates the form and submits the data.
 * If any required fields are missing, it shows an error message.
 * If the submission is successful, it resets the form and image.
 */
async function handleSubmit() {
  const { ean, name } = form.value
  if (!isFilled({ean, name})) {
    toastService.alertError('Missing input', 'Fields with * are required')

    return
  }

  const data = {
    ...form.value,
    img: {
      sm: image100.value,
      lg: image500.value
    }
  }

  try {
    const newProduct = await foodService.post(data)

    resetImage()
    form.value = getDefaultValues()
    emit('new-product', newProduct)
    emit('close')
    toastService.alertSuccess('Product created!', 'The new product has been successfully added to the database')
  } catch (error) {
    handleError(error, toast)
  }
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <!-- Image section -->
    <label class="label">Product Image</label>
    <input class="file-input" ref="fileInput" type="file" accept="image/*" capture="environment" @change="handleImage"
      :disabled="imagePreview" />
    <div v-if="imagePreview" class="image-preview">
      <img :src="imagePreview" alt="Preview" />
      <Button severity="secondary" @click="retake">Retake/Reselect</Button>
    </div>

    <!-- base info section -->
    <label class="label">EAN *</label>
    <input id="ean-input" class="input" v-model="form.ean" v-keyfilter.num required />

    <label class="label">Name *</label>
    <input id="name-input" class="input" v-model="form.name" required />

    <label class="label">Brand</label>
    <input id="brand-input" class="input" v-model="form.brand" />

    <!-- Nutrient content section -->
    <h3 class="section-title">Fill out the values per 100g</h3>
    <div class="nutrition-grid">
      <label class="inline-field">
        <span>kcal</span>
        <input id="kcal-input" class="nutri-input" type="number" v-model.number="form.kcal_100g" />
      </label>

      <label class="inline-field">
        <span>Fat</span>
        <input id="fat-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.fat" />
      </label>

      <label class="inline-field">
        <span>Saturated Fat</span>
        <input id="saturated-fat-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.saturatedFat" />
      </label>

      <label class="inline-field">
        <span>Carbohydrates</span>
        <input id="carbohydrates-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.carbohydrates" />
      </label>

      <label class="inline-field">
        <span>Sugars</span>
        <input id="sugars-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.sugars" />
      </label>

      <label class="inline-field">
        <span>Protein</span>
        <input id="protein-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.protein" />
      </label>

      <label class="inline-field">
        <span>Salt</span>
        <input id="salt-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.salt" />
      </label>

      <label class="inline-field">
        <span>Fiber</span>
        <input id="fiber-input" class="nutri-input" type="number" step="0.1" v-model.number="form.macros_100g.fiber" />
      </label>
    </div>

    <Button class="btn-primary btn-lg" type="submit">Save</Button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--grey-50);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--light-shadow);
  max-width: 400px;
  margin: auto;
  font-size: var(--text-base);
  color: var(--base-font-grey);
}

.label {
  font-weight: var(--bold);
  font-size: var(--text-sm);
}

.input,
.file-input {
  padding: 0.5rem;
  font-size: var(--text-base);
  border: 1px solid var(--grey-300);
  border-radius: 4px;
  background-color: var(--white);
  color: var(--base-font-grey);
}

.file-input {
  width: 100%;

}

.button {
  font-weight: var(--medium);
  font-size: var(--text-sm);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button.primary {
  background-color: var(--primary-600);
  color: var(--white);
}

.button.danger {
  background-color: var(--red-500);
  color: var(--white);
  margin-top: 0.5rem;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview img {
  width: 200px;
  height: auto;
  object-fit: cover;
  border: 2px solid var(--primary-500);
  border-radius: 6px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}


/* nutrient-part */
.section-title {
  font-size: var(--text-lg, 1.125rem);
  font-weight: var(--bold);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--base-font-grey);
}

.nutrition-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inline-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--base-font-grey);
}

.inline-field span {
  flex: 1;
}

.nutri-input {
  width: 80px;
  padding: 0.4rem;
  font-size: var(--text-sm);
  border: 1px solid var(--grey-300);
  border-radius: 4px;
  background-color: var(--white);
  color: var(--base-font-grey);
}
</style>
