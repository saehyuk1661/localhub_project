<script setup>
const emit = defineEmits(['open-directory', 'navigate'])
const props = defineProps({
  featuredData: {
    type: Array,
    default: () => []
  },
  recentPosts: {
    type: Array,
    default: () => []
  }
})

function openDirectory(category) {
  emit('open-directory', category)
}

function goPage(page) {
  emit('navigate', page)
}
</script>

<template>
  <section class="space-y-10">
    <div class="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
      <div
        class="absolute inset-0 bg-[url('/gumi-nature.jpg')] bg-cover bg-center brightness-75"
      ></div>
      <div class="relative px-6 py-24 sm:px-10 sm:py-28">
        <h1 class="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          어디로 떠나볼까요? <span class="text-sky-300">구미·경북 여행의 모든 것</span>
        </h1>
        <p class="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
          지역 정보와 커뮤니티를 한 곳에서 확인하세요. 여행, 맛집, 축제, 숙소까지 모두 담았습니다.
        </p>

        <div class="mt-8 flex flex-row items-center gap-3">
          <input
            type="text"
            class="flex-1 rounded-full border border-slate-200 bg-white/95 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-slate-400"
            placeholder="구미에서 가볼 장소를 검색해보세요"
          />
          <button
            class="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            @click="goPage('list')"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-5">
      <button
        class="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5"
        @click="openDirectory('spots')"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl">🏛️</div>
          <p class="text-sm font-semibold text-slate-800">관광지</p>
        </div>
      </button>

      <button
        class="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5"
        @click="openDirectory('restaurants')"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl">🍔</div>
          <p class="text-sm font-semibold text-slate-800">맛집</p>
        </div>
      </button>

      <button
        class="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5"
        @click="openDirectory('festivals')"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl">🥳</div>
          <p class="text-sm font-semibold text-slate-800">축제/공연</p>
        </div>
      </button>

      <button
        class="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5"
        @click="openDirectory('accommodations')"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl">🛏️</div>
          <p class="text-sm font-semibold text-slate-800">숙박</p>
        </div>
      </button>

      <button
        class="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5"
        @click="goPage('list')"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl">💬</div>
          <p class="text-sm font-semibold text-slate-800">커뮤니티</p>
        </div>
      </button>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <div class="space-y-4">
        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900">추천 여행지</h2>
            <button class="text-sm font-medium text-slate-500 hover:text-slate-700" @click="openDirectory('spots')">더 보기</button>
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <article
              v-for="item in featuredData"
              :key="item.id"
              class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
            >
              <img
                :src="item.image"
                alt=""
                class="h-40 w-full object-cover"
              />
              <div class="p-5">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ item.label }}</p>
                <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ item.name }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.address }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900">최근 등록된 글</h2>
            <button class="text-sm font-medium text-slate-500 hover:text-slate-700" @click="goPage('list')">
              모두 보기
            </button>
          </div>
          <div class="mt-5 space-y-4">
            <article
              v-for="post in recentPosts"
              :key="post.id"
              class="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:border-slate-300"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-slate-900">{{ post.title }}</h3>
                <span class="text-xs text-slate-500">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
              </div>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{{ post.content }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>