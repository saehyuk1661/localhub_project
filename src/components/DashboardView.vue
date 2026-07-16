<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  allData: {
    type: Object,
    default: () => ({
      spots: [],
      restaurants: [],
      festivals: [],
      accommodations: []
    })
  },
  posts: {
    type: Array,
    default: () => []
  }
})

const donutCanvas = ref(null)
const barCanvas = ref(null)
let donutChart = null
let barChart = null

const categoryCounts = computed(() => ({
  spots: props.allData.spots?.length ?? 0,
  restaurants: props.allData.restaurants?.length ?? 0,
  festivals: props.allData.festivals?.length ?? 0,
  accommodations: props.allData.accommodations?.length ?? 0
}))

const formattedPostDates = computed(() => {
  const counts = {}
  props.posts.forEach(post => {
    const date = post.createdAt ? new Date(post.createdAt) : null
    if (!date || Number.isNaN(date.getTime())) return
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-7)
})

function createDonutChart() {
  if (!donutCanvas.value) return
  if (donutChart) donutChart.destroy()

  donutChart = new Chart(donutCanvas.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['관광지', '맛집', '축제', '숙박'],
      datasets: [
        {
          data: [
            categoryCounts.value.spots,
            categoryCounts.value.restaurants,
            categoryCounts.value.festivals,
            categoryCounts.value.accommodations
          ],
          backgroundColor: ['#ef4444', '#fbbf24', '#22c55e', '#1d4ed8'],
          borderColor: 'rgba(148, 163, 184, 0.16)',
          borderWidth: 1,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#475569',
            boxWidth: 12,
            padding: 16,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: '#38bdf8',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0'
        }
      }
    }
  })
}

function createBarChart() {
  if (!barCanvas.value) return
  if (barChart) barChart.destroy()

  const labels = formattedPostDates.value.map(item => item[0])
  const values = formattedPostDates.value.map(item => item[1])

  barChart = new Chart(barCanvas.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '게시글 수',
          data: values,
          backgroundColor: '#38bdf8',
          borderRadius: 10,
          categoryPercentage: 0.65,
          barPercentage: 0.7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: '#475569'
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#475569',
            precision: 0
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.16)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0'
        }
      }
    }
  })
}

watch(
  [categoryCounts, formattedPostDates],
  () => {
    createDonutChart()
    createBarChart()
  },
  { immediate: true }
)

onMounted(() => {
  createDonutChart()
  createBarChart()
})

onBeforeUnmount(() => {
  donutChart?.destroy()
  barChart?.destroy()
})
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.24em] text-slate-500">대시보드</p>
          <h2 class="text-2xl font-semibold text-slate-900">공공데이터 & 커뮤니티 통계</h2>
        </div>
        <p class="max-w-xl text-sm leading-6 text-slate-600">
          구미 지역 공공데이터와 게시글 활동을 한눈에 파악할 수 있는 시각화 뷰입니다.
        </p>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">지역 정보 현황</p>
              <h3 class="mt-2 text-lg font-semibold text-slate-900">카테고리별 비율</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              최신 데이터
            </span>
          </div>
          <div class="h-80">
            <canvas ref="donutCanvas"></canvas>
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">커뮤니티 현황</p>
              <h3 class="mt-2 text-lg font-semibold text-slate-900">게시글 작성 추이</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              최근 7일
            </span>
          </div>
          <div class="h-80">
            <canvas ref="barCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>