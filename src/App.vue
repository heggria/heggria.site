<script setup lang="ts">
import Giscus from '@giscus/vue'
import { isDark } from './logics'

const route = useRoute()

const imageModel = ref<HTMLImageElement>()

useEventListener('click', async (e) => {
  const path = Array.from(e.composedPath())
  const first = path[0]
  if (!(first instanceof HTMLElement))
    return
  if (first.tagName !== 'IMG')
    return
  if (first.classList.contains('no-preview'))
    return
  if (path.some(el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName)))
    return
  if (!path.some(el => el instanceof HTMLElement && el.classList.contains('prose')))
    return

  // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
  const pos = first.getBoundingClientRect()
  await new Promise(resolve => setTimeout(resolve, 50))
  const newPos = first.getBoundingClientRect()
  if (pos.left !== newPos.left || pos.top !== newPos.top)
    return

  imageModel.value = first as HTMLImageElement
})

onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined
    e.preventDefault()
  }
})
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <div class="mt-10 mb-6 prose m-auto flex slide-enter animate-delay-1200!">
      <Giscus
        repo="heggria/heggria.site"
        repo-id="R_kgDOMu9i4g"
        category="Announcements"
        category-id="DIC_kwDOMu9i4s4Cikd8"
        mapping="pathname"
        strict="1"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        :theme="isDark ? 'dark' : 'light'"
        lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
      />
    </div>
    <Footer :key="route.path" />
  </main>
  <Transition name="fade">
    <div v-if="imageModel" fixed top-0 left-0 right-0 bottom-0 z-500 backdrop-blur-7 @click="imageModel = undefined">
      <div absolute top-0 left-0 right-0 bottom-0 bg-black:30 z--1 />
      <img :src="imageModel.src" :alt="imageModel.alt" :class="imageModel.className" max-w-screen max-h-screen w-full h-full object-contain>
    </div>
  </Transition>
</template>
