<script setup>
import { ref } from 'vue'

const emit = defineEmits(['editPost', 'deletePost', 'back'])
const props = defineProps({
  post: {
    type: Object,
    default: null
  }
})

const isModalOpen = ref(false)
const passwordInput = ref('')
const modalAction = ref('')
const errorMessage = ref('')

function openModal(action) {
  modalAction.value = action
  passwordInput.value = ''
  errorMessage.value = ''
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  passwordInput.value = ''
  errorMessage.value = ''
}

function confirmAction() {
  if (!props.post) return

  if (passwordInput.value.trim() !== props.post.password) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  if (modalAction.value === 'edit') {
    emit('editPost', props.post)
  } else if (modalAction.value === 'delete') {
    emit('deletePost', props.post.id)
  }
  closeModal()
}
</script>

<template>
  <section class="space-y-6">
    <button class="text-sm text-slate-600 hover:text-slate-900" @click="emit('back')">
      ← 목록으로 돌아가기
    </button>

    <div v-if="!post" class="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
      선택된 게시글이 없습니다.
    </div>

    <article v-else class="rounded-3xl bg-white p-8 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm text-slate-500">게시글 상세보기</p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-900">{{ post.title }}</h1>
          <p class="mt-2 text-sm text-slate-500">{{ new Date(post.createdAt).toLocaleString() }}</p>
        </div>
        <div class="flex gap-3">
          <button class="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" @click="openModal('edit')">
            수정
          </button>
          <button class="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600" @click="openModal('delete')">
            삭제
          </button>
        </div>
      </div>

      <div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
        <p class="whitespace-pre-line text-base leading-8">{{ post.content }}</p>
      </div>
    </article>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 class="text-xl font-semibold text-slate-900">
          {{ modalAction === 'edit' ? '수정 비밀번호 확인' : '삭제 비밀번호 확인' }}
        </h2>
        <p class="mt-3 text-sm text-slate-500">
          게시글 {{ modalAction === 'edit' ? '수정' : '삭제' }}을 위해 비밀번호를 입력하세요.
        </p>

        <input
          v-model="passwordInput"
          type="password"
          maxlength="4"
          placeholder="4자리 비밀번호"
          class="mt-5 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
        />

        <p v-if="errorMessage" class="mt-3 text-sm text-rose-600">{{ errorMessage }}</p>

        <div class="mt-6 flex justify-end gap-3">
          <button class="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" @click="closeModal">
            취소
          </button>
          <button class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" @click="confirmAction">
            확인
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