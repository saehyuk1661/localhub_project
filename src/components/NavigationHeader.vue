<script setup>
import { ref } from 'vue'

const emit = defineEmits(['navigate', 'search', 'change-page'])
const props = defineProps({
  currentPage: {
    type: String,
    default: 'home'
  }
})

const searchText = ref('')

function go(page) {
  emit('navigate', page)
}

function submitSearch() {
  emit('search', searchText.value.trim())
}

function changePage(page) {
  emit('change-page', page)
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b bg-white/95 px-4 py-4 shadow-sm backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
      <div class="text-2xl font-bold text-slate-800" style="font-family: 'Playfair Display', serif;">
        구미 HUB
      </div>

      <nav class="hidden items-center gap-4 md:flex">
        <button class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="go('home')">
          홈
        </button>
        <button class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="go('directory')">
          관광안내
        </button>
        <button class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="go('list')">
          커뮤니티 둘러보기
        </button>
        <button
          class="rounded-full px-3 py-2 text-sm font-medium text-slate-600hover:bg-slate-100" @click="changePage('dashboard')"
        >
          대시보드
        </button>
        <button
          class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          @click="go('write')"
        >
          글쓰기
        </button>
      </nav>

      <form class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2" @submit.prevent="submitSearch">
        <input
          v-model="searchText"
          type="text"
          placeholder="구미·경북 검색"
          class="w-44 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-56"
        />
        <button type="submit" class="rounded-full bg-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-300">
          🔍
        </button>
      </form>
    </div>
  </header>
</template>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>