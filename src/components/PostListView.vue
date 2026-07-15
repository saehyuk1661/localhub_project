<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['viewDetail', 'writeNew', 'search'])
const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  searchTerm: {
    type: String,
    default: ''
  }
})

const query = ref(props.searchTerm)
const page = ref(1)
const pageSize = 5

watch(
  () => props.searchTerm,
  value => {
    query.value = value
    page.value = 1
  }
)

const filteredPosts = computed(() => {
  const lowerQuery = query.value.trim().toLowerCase()
  if (!lowerQuery) {
    return [...props.posts]
  }
  return props.posts.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
    )
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function searchNow() {
  page.value = 1
  emit('search', query.value.trim())
}

function prevPage() {
  if (page.value > 1) page.value -= 1
}

function nextPage() {
  if (page.value < pageCount.value) page.value += 1
}
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-3xl bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">커뮤니티 게시판</h2>
          <p class="mt-1 text-sm text-slate-500">구미·경북 지역의 최신 여행 정보와 질문을 공유해보세요.</p>
        </div>

        <button
          class="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          @click="emit('writeNew')"
        >
          + 새 글 쓰기
        </button>
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          v-model="query"
          type="text"
          placeholder="제목 또는 내용을 검색하세요"
          class="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
        />
        <button
          class="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          @click="searchNow"
        >
          검색
        </button>
      </div>

      <div class="mt-8 overflow-hidden rounded-3xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200 bg-white text-left">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">제목</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">등록일</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">상세</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-sm text-slate-800">{{ post.title }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4">
                <button
                  class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  @click="emit('viewDetail', post)"
                >
                  보기
                </button>
              </td>
            </tr>
            <tr v-if="paginatedPosts.length === 0">
              <td colspan="3" class="px-6 py-10 text-center text-slate-500">
                검색 결과가 없습니다. 다른 키워드로 다시 시도해보세요.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-5 flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <div>
          전체 {{ filteredPosts.length }}개 게시글 · 페이지 {{ page }} / {{ pageCount }}
        </div>

        <div class="flex items-center gap-3">
          <button
            class="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            @click="prevPage"
            :disabled="page === 1"
          >
            이전
          </button>
          <button
            class="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            @click="nextPage"
            :disabled="page === pageCount"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>