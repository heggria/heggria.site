<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

// 创建一个响应式的 totalOnline 变量
const totalOnline = ref<number>((window as any).totalOnline || 1)

onMounted(() => {
  // 监听外部 OnelineUpdate 事件并更新 totalOnline
  const handleOnelineUpdate = (e: any) => {
    totalOnline.value = e.detail.count
  }

  window.addEventListener('TotalOnlineChanged', handleOnelineUpdate)

  onUnmounted(() => {
    // 移除事件监听器和定时器
    window.removeEventListener('TotalOnlineChanged', handleOnelineUpdate)
  })
})
</script>

<template>
  <div class="mt-10 mb-6 prose m-auto flex slide-enter animate-delay-1200!">
    <span class="text-sm op50"><a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color:inherit">CC BY-NC-SA 4.0</a> 2024-PRESENT © Heggria · <a href="https://beian.miit.gov.cn/" target="_blank" style="color:inherit">京ICP备2024086046号-1</a> ·
      <a href="https://icp.gov.moe/?keyword=20249988" target="_blank" style="color:inherit">萌ICP备20249988号</a> · 在线人数：{{ totalOnline }}
    </span>
    <div class="flex-auto" />
  </div>
</template>
