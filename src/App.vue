<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import NavigationHeader from './components/NavigationHeader.vue'
import HomeView from './components/HomeView.vue'
import DataDirectoryView from './components/DataDirectoryView.vue'
import PostListView from './components/PostListView.vue'
import PostDetailView from './components/PostDetailView.vue'
import PostWriteView from './components/PostWriteView.vue'
import LocalChatBot from './components/LocalChatBot.vue'
import DashboardView from './components/DashboardView.vue'
import WeatherCard from './components/WeatherCard.vue'


const currentPage = ref('home')
const selectedDirectory = ref('spots')
const selectedPost = ref(null)
const searchTerm = ref('')

const directoryData = reactive({
  spots: [],
  restaurants: [],
  festivals: [],
  accommodations: []
})

const posts = ref([])
const postStorageKey = 'localhub_posts'

const defaultPosts = [
  {
    id: 'post-01',
    title: '구미 대표 맛집 추천',
    content:
      '구미에는 향긋한 김치찜과 함께 즐기는 현지 맛집이 많습니다. 금오산 근처의 작은 한식당과 시내 카페를 추천해요.',
    password: '1234',
    category: 'community',
    createdAt: '2026-07-14T09:20:00.000Z'
  },
  {
    id: 'post-02',
    title: '금오산 드라이브 코스',
    content:
      '금오산 드라이브 코스는 봄과 가을에 특히 아름답습니다. 전망대에서 보는 구미 시내와 낙동강 경치가 인상적이에요.',
    password: '5678',
    category: 'community',
    createdAt: '2026-07-13T16:45:00.000Z'
  },
  {
    id: 'post-03',
    title: '구미 숙박 정보',
    content:
      '구미 시내와 가까운 깔끔한 호텔, 펜션이 있습니다. 출장이나 여행 모두 편안한 숙소가 많아서 일정 짜기 좋아요.',
    password: '0000',
    category: 'community',
    createdAt: '2026-07-12T11:05:00.000Z'
  }
]

function savePosts() {
  window.localStorage.setItem(postStorageKey, JSON.stringify(posts.value))
}

function loadPosts() {
  const raw = window.localStorage.getItem(postStorageKey)
  if (raw) {
    try {
      posts.value = JSON.parse(raw)
      return
    } catch (error) {
      console.error('localStorage 데이터를 읽는 중 오류 발생:', error)
    }
  }
  posts.value = defaultPosts
  savePosts()
}

function normalizeDirectoryItems(items, categoryId) {
  return (items || []).map((item, index) => ({
    id: item.id || item.contentid || `${categoryId}-${index}`,
    name: item.name || item.title || '이름 없음',
    address: item.address || [item.addr1, item.addr2].filter(Boolean).join(' ') || '주소 정보가 없습니다.',
    image: item.image || item.firstimage || item.firstimage2 || '',
    category: categoryId,
    raw: item
  }))
}

function categorizeItem(item) {
  const contentTypeId = String(item.contenttypeid || item.contentTypeId || '')
  const contentType = String(item.contentType || item.contenttype || item.type || '').toLowerCase()

  if (contentTypeId === '39' || contentType.includes('음식') || contentType.includes('맛집')) {
    return 'restaurants'
  }

  if (contentTypeId === '15' || contentType.includes('축제') || contentType.includes('공연') || contentType.includes('행사')) {
    return 'festivals'
  }

  if (contentTypeId === '32' || contentType.includes('숙박') || contentType.includes('호텔') || contentType.includes('펜션')) {
    return 'accommodations'
  }

  return 'spots'
}

async function loadDirectoryData() {
  try {
    const response = await fetch('/all-data.json')
    if (!response.ok) {
      throw new Error('데이터를 불러오는 데 실패했습니다.')
    }

    const json = await response.json()
    const grouped = {
      spots: [],
      restaurants: [],
      festivals: [],
      accommodations: []
    }

    if (Array.isArray(json.items) && json.items.length) {
      json.items.forEach(item => {
        const category = categorizeItem(item)
        grouped[category].push(normalizeDirectoryItems([item], category)[0])
      })
    } else {
      grouped.spots = normalizeDirectoryItems(json.spots || [], 'spots')
      grouped.restaurants = normalizeDirectoryItems(json.restaurants || [], 'restaurants')
      grouped.festivals = normalizeDirectoryItems(json.festivals || [], 'festivals')
      grouped.accommodations = normalizeDirectoryItems(json.accommodations || [], 'accommodations')
    }

    directoryData.spots = grouped.spots
    directoryData.restaurants = grouped.restaurants
    directoryData.festivals = grouped.festivals
    directoryData.accommodations = grouped.accommodations
  } catch (error) {
    console.error('all-data.json 로드 오류:', error)
  }
}

onMounted(() => {
  loadDirectoryData()
  loadPosts()
})

watch(posts, savePosts, { deep: true })

const recentPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

const featuredPlaces = computed(() => {
  const findFirstWithImage = list => list.find(item => item.image) || list[0]
  const items = []

  if (directoryData.spots.length) {
    items.push({ ...findFirstWithImage(directoryData.spots), label: '관광지' })
  }
  if (directoryData.restaurants.length) {
    items.push({ ...findFirstWithImage(directoryData.restaurants), label: '맛집' })
  }
  if (directoryData.festivals.length) {
    items.push({ ...findFirstWithImage(directoryData.festivals), label: '축제' })
  }
  if (directoryData.accommodations.length) {
    items.push({ ...findFirstWithImage(directoryData.accommodations), label: '숙박' })
  }

  return items
})

function navigate(page) {
  currentPage.value = page
}

function navigateDirectory(category) {
  selectedDirectory.value = category
  currentPage.value = 'directory'
}

function openPostDetail(post) {
  selectedPost.value = post
  currentPage.value = 'detail'
}

function writeNewPost() {
  selectedPost.value = null
  currentPage.value = 'write'
}

function editPost(post) {
  selectedPost.value = post
  currentPage.value = 'write'
}

function savePost(payload) {
  if (payload.id) {
    const index = posts.value.findIndex(item => item.id === payload.id)
    if (index >= 0) {
      posts.value[index] = { ...posts.value[index], ...payload }
      selectedPost.value = posts.value[index]
    }
  } else {
    const newPost = {
      ...payload,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    posts.value.unshift(newPost)
    selectedPost.value = newPost
  }
  currentPage.value = 'detail'
}

function deletePost(postId) {
  posts.value = posts.value.filter(item => item.id !== postId)
  selectedPost.value = null
  currentPage.value = 'list'
}

function handleSearch(term) {
  searchTerm.value = term
  currentPage.value = 'list'
}
</script>

<template>
  
  <div class="min-h-screen bg-slate-200 text-slate-900">
    <NavigationHeader
      :currentPage="currentPage"
      @navigate="navigate"
      @search="handleSearch"
      @change-page="navigate"
    />

    <main class="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <HomeView
        v-if="currentPage === 'home'"
        :featuredData="featuredPlaces"
        :recentPosts="recentPosts"
        @open-directory="navigateDirectory"
        @navigate="navigate"
      />
      <WeatherCard
        v-else-if="currentPage === 'weather'"
      />
      <DashboardView
        v-else-if="currentPage === 'dashboard'"
        :allData="directoryData"
        :posts="posts"
      />

      <DataDirectoryView
        v-else-if="currentPage === 'directory'"
        :directoryData="directoryData"
        :selectedCategory="selectedDirectory"
        @changeCategory="selectedDirectory = $event"
        @backHome="navigate('home')"
      />

      <PostListView
        v-else-if="currentPage === 'list'"
        :posts="posts"
        :searchTerm="searchTerm"
        @viewDetail="openPostDetail"
        @writeNew="writeNewPost"
        @search="handleSearch"
      />

      <PostDetailView
        v-else-if="currentPage === 'detail'"
        :post="selectedPost"
        @editPost="editPost"
        @deletePost="deletePost"
        @back="navigate('list')"
      />

      <PostWriteView
        v-if="currentPage === 'write'"
        :post="selectedPost"
        @savePost="savePost"
        @cancel="navigate('list')"
      />
    </main>

    <LocalChatBot />
  </div>
</template>



<style>
body {
  margin: 0;
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  background: linear-gradient(180deg, #dbeafe 0%, #eff6ff 45%, #f8fafc 100%);
}

.app {
  min-height: 100vh;
  padding: 40px 20px 80px;
}

.app h1 {
  margin: 0 0 24px;
  text-align: center;
  color: #0f172a;
}
</style>
