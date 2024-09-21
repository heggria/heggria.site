<script setup lang="ts">
defineOptions({
  name: 'DigitsInput',
})
defineProps<{
  label: string
  min?: number
  max?: number
}>()
const value = defineModel<[number, number]>({
  required: true,
})
</script>

<template>
  <FloatLabel>
    <InputGroup>
      <InputNumber
        :model-value="value[0] * 100" suffix="%" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="2"
        fluid w-full :min :max :step="1"
        @update:model-value="v => value[0] = v / 100"
      />
      <InputNumber
        :model-value="value[1] * 100"
        suffix="%" :use-grouping="false" :min-fraction-digits="0"
        :max-fraction-digits="2" fluid w-full :min :max :step="1"

        @update:model-value="v => value[1] = v / 100"
      />
    </InputGroup>
    <label for="username">{{ label }}</label>
  </FloatLabel>
</template>
