<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['changeCategory', 'backHome'])
const props = defineProps({
  directoryData: {
    type: Object,
    default: () => ({})
  },
  selectedCategory: {
    type: String,
    default: 'spots'
  }
})

const activeCategory = ref(props.selectedCategory)

watch(
  () => props.selectedCategory,
  value => {
    activeCategory.value = value
  }
)

const categories = [
  { id: 'spots', label: '관광지' },
  { id: 'restaurants', label: '맛집' },
  { id: 'festivals', label: '축제' },
  { id: 'accommodations', label: '숙박' }
]

function selectCategory(categoryId) {
  activeCategory.value = categoryId
  emit('changeCategory', categoryId)
}

const items = computed(() => {
  return props.directoryData[activeCategory.value] || []
})

function fixedImage(event) {
  event.target.src =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">구미 경북 공공 데이터</h2>
        <p class="mt-1 text-sm text-slate-500">
          각 카테고리를 선택해 자세한 지역 정보를 확인할 수 있습니다.
        </p>
      </div>
      <button class="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700" @click="emit('backHome')">
        홈으로 돌아가기
      </button>
    </div>

    <div class="rounded-3xl bg-white p-4 shadow-sm">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="[
            'rounded-full px-4 py-2 text-sm font-medium transition',
            category.id === activeCategory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
          ]"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm"
      >
        <img
          :src="item.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'"
          :alt="item.name"
          class="h-52 w-full object-cover"
          @error="fixedImage"
        />
        <div class="p-5">
          <p class="text-xs uppercase tracking-[0.24em] text-slate-500">
            {{ categories.find(category => category.id === activeCategory)?.label }}
          </p>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ item.name }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.address }}</p>
        </div>
      </article>
    </div>

    <div v-if="items.length === 0" class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
      데이터가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.
    </div>
  </section>
</template>

<style scoped>
button {
  min-width: 5rem;
}
</style>