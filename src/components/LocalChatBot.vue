<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const prompt = ref('')
const isLoading = ref(false)
const messages = ref([
  {
    role: 'assistant',
    content: '구미·경북 지역에 대한 질문이 있으시면 편하게 물어보세요.'
  }
])

function togglePanel() {
  isOpen.value = !isOpen.value
}

async function sendMessage() {
  const text = prompt.value.trim()
  if (!text) return

  const userMessage = { role: 'user', content: text }
  messages.value.push(userMessage)
  prompt.value = ''
  isLoading.value = true

  try {
    // 브라우저에서는 /api/chat 으로 요청 (netlify.toml에서 리디렉트)
    const endpoint = '/api/chat'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: messages.value,
        max_tokens: 400,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI proxy 오류: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    // 함수가 assistant 필드로 간단화된 응답을 반환합니다.
    const assistantText =
      result?.assistant ||
      result?.choices?.[0]?.message?.content ||
      '응답을 가져오지 못했습니다.'

    messages.value.push({ role: 'assistant', content: assistantText })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: '죄송합니다. 챗봇 응답을 가져오는 중 오류가 발생했습니다.'
    })
    console.error('ChatBot 오류:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="w-[320px] rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl"
      >
        <div class="flex items-center justify-between rounded-t-3xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p class="text-sm font-semibold">구미 Hub AI 가이드</p>
            <p class="text-xs text-slate-300">구미·경북 전문 지역 가이드</p>
          </div>
          <button class="rounded-full bg-white/10 px-3 py-1 text-xs" @click="togglePanel">
            닫기
          </button>
        </div>

        <div class="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'rounded-3xl px-4 py-3 text-sm leading-6',
              message.role === 'assistant'
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-900 text-white'
            ]"
          >
            <p>{{ message.content }}</p>
          </div>
        </div>

        <div class="rounded-b-3xl border-t border-slate-200 bg-slate-50 p-4">
          <textarea
            v-model="prompt"
            rows="3"
            class="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
            placeholder="구미나 경북 여행을 물어보세요"
          ></textarea>

          <div class="mt-3 flex items-center justify-between gap-3">
            <button
              class="ml-auto rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
              @click="sendMessage"
              :disabled="isLoading"
            >
              {{ isLoading ? '응답 생성 중...' : '보내기' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <button
      class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition hover:bg-slate-700"
      @click="togglePanel"
      type="button"
    >
      💬
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>