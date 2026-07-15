<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['savePost', 'cancel'])
const props = defineProps({
  post: {
    type: Object,
    default: null
  }
})

const title = ref(props.post?.title || '')
const content = ref(props.post?.content || '')
const password = ref(props.post?.password || '')
const errorMessage = ref('')

watch(
  () => props.post,
  value => {
    title.value = value?.title || ''
    content.value = value?.content || ''
    password.value = value?.password || ''
    errorMessage.value = ''
  }
)

function submitPost() {
  if (!title.value.trim()) {
    errorMessage.value = '제목을 입력해주세요.'
    return
  }
  if (!content.value.trim()) {
    errorMessage.value = '내용을 입력해주세요.'
    return
  }
  if (password.value.trim().length !== 4) {
    errorMessage.value = '4자리 비밀번호를 정확히 입력해주세요.'
    return
  }

  emit('savePost', {
    id: props.post?.id,
    title: title.value.trim(),
    content: content.value.trim(),
    password: password.value.trim(),
    category: 'community'
  })
}
</script>

<template>
  <section class="space-y-6">
    <button class="text-sm text-slate-600 hover:text-slate-900" @click="emit('cancel')">
      ← 목록으로 돌아가기
    </button>

    <div class="rounded-3xl bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-semibold text-slate-900">
        {{ props.post ? '게시글 수정' : '새 글 작성' }}
      </h1>
      <p class="mt-2 text-sm text-slate-500">
        구미·경북 정보를 나눌 수 있는 글을 작성해보세요.
      </p>

      <div class="mt-8 space-y-5">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">제목</span>
          <input
            v-model="title"
            type="text"
            class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="글 제목을 입력하세요"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">내용</span>
          <textarea
            v-model="content"
            rows="7"
            class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="내용을 자세히 입력해주세요"
          ></textarea>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">4자리 비밀번호</span>
          <input
            v-model="password"
            type="password"
            maxlength="4"
            class="mt-2 w-40 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="0000"
          />
        </label>

        <p v-if="errorMessage" class="text-sm text-rose-600">{{ errorMessage }}</p>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            class="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-100"
            @click="emit('cancel')"
            type="button"
          >
            취소
          </button>
          <button
            class="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            @click="submitPost"
            type="button"
          >
            {{ props.post ? '수정 완료' : '등록하기' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>