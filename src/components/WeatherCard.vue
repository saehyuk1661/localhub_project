<script setup>
import { ref, onMounted } from 'vue'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const cities = [
  { name: '구미', q: 'Gumi' },
  { name: '경주', q: 'Gyeongju' },
  { name: '포항', q: 'Pohang' },
  { name: '안동', q: 'Andong' }
]

const city = ref(cities[0].q)
const weather = ref(null)
const loading = ref(false)
const error = ref('')

async function loadWeather() {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${API_KEY}&units=metric&lang=kr`
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message)
    }

    weather.value = data
  } catch (e) {
    error.value = '날씨 정보를 불러오지 못했습니다.'
    console.error(e)
  }

  loading.value = false
}

function guide() {
  if (!weather.value) return ''

  const temp = weather.value.main.temp
  const desc = weather.value.weather[0].description

  if (desc.includes('비'))
    return '☔ 오늘은 실내 관광이나 카페 여행을 추천합니다.'

  if (temp >= 20 && temp <= 28)
    return '⭐⭐⭐⭐⭐ 여행하기 최고의 날씨입니다.'

  if (temp > 30)
    return '🥵 더운 날입니다. 실내 관광을 추천합니다.'

  if (temp < 5)
    return '🥶 추운 날입니다. 따뜻한 복장을 준비하세요.'

  return '🙂 여행하기 좋은 날입니다.'
}

onMounted(loadWeather)
</script>

<template>

  <div class="max-w-xl mx-auto rounded-3xl bg-white shadow-lg p-8">

    <h2 class="text-3xl font-bold mb-6">
      🌤 구미·경북 실시간 날씨
    </h2>

    <select
      v-model="city"
      @change="loadWeather"
      class="border rounded-lg p-2 mb-6"
    >
      <option
        v-for="c in cities"
        :key="c.q"
        :value="c.q"
      >
        {{ c.name }}
      </option>
    </select>

    <div v-if="loading">
      불러오는 중...
    </div>

    <div v-else-if="weather">

      <img
        :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
      >

      <h3 class="text-2xl font-bold">
        {{ weather.name }}
      </h3>

      <p>🌡 {{ weather.main.temp }} ℃</p>

      <p>🤗 체감 {{ weather.main.feels_like }} ℃</p>

      <p>☁ {{ weather.weather[0].description }}</p>

      <p>💧 습도 {{ weather.main.humidity }}%</p>

      <p>🌬 풍속 {{ weather.wind.speed }} m/s</p>

      <div class="mt-6 rounded-xl bg-sky-100 p-4">

        <h4 class="font-bold">
          여행 적합도
        </h4>

        <p>{{ guide() }}</p>

      </div>

    </div>

    <div class="text-red-500 mt-4">
      {{ error }}
    </div>

  </div>
</template>