<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div>
    <label class="text-sm text-gray-600 ml-2">{{ label }}</label>
    <slot />
    <div v-if="description" class="mt-1 text-xs text-gray-400 ml-2">
      {{ description }}
    </div>
  </div>
</template>
