<script setup lang="ts">
const salaryInfo = ref({
  monthBase: 100000,
  socialSecurityBase: 100000,
  providentFundBase: 100000,
})

const salaryCount = computed(() => {
  return {
    total: salaryInfo.value.monthBase + salaryInfo.value.socialSecurityBase + salaryInfo.value.providentFundBase,
  }
})
</script>

<template>
  <div py-4>
    <div flex gap-4>
      <FloatLabel flex-1>
        <InputNumber
          v-model="salaryInfo.monthBase" prefix="¥ " label="213123" input-id="integeronly"
          :min-fraction-digits="2" :max-fraction-digits="5" fluid w-full
        />
        <label for="username">月收入</label>
      </FloatLabel>

      <FloatLabel flex-1>
        <InputNumber v-model="salaryInfo.socialSecurityBase" suffix="" input-id="withoutgrouping" w-full />
        <label for="username">社保基数</label>
      </FloatLabel>

      <FloatLabel flex-1>
        <InputNumber v-model="salaryInfo.providentFundBase" suffix="" input-id="minmaxfraction" w-full />
        <label for="username">公积金基数</label>
      </FloatLabel>
    </div>
    <div flex gap-4 py-4>
      <Card flex-1>
        <template #title>
          总收入
        </template>
        <template #content>
          {{ salaryCount.total }}
        </template>
      </Card>
      <Card flex-1>
        <template #title>
          总收入
        </template>
        <template #content>
          {{ salaryCount.total }}
        </template>
      </Card>
      <Card flex-1>
        <template #title>
          总收入
        </template>
        <template #content>
          {{ salaryCount.total }}
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.slider {
  appearance: none;
  height: 20px;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  --uno: border border-base rounded of-hidden bg-gray/20;
}

.field {
  content: attr(label);
  text-align: center;
  margin-bottom: 4px;
}
</style>
