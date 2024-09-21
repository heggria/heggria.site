<script setup lang="ts">
defineOptions({
  name: 'DigitsInput',
})
defineProps<{
  label: string
  description?: string
  min?: number
  max?: number
}>()
const value = defineModel<[number, number]>({
  required: true,
})
</script>

<template>
  <FormField :label :description>
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
  </FormField>
</template>
