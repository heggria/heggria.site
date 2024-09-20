<script setup lang="ts">
import { UrbanPolicy } from './constants'
import { calculateAnnualPersonalIncomeTax } from './utils'

const salaryInfo = ref({
  selectedCity: UrbanPolicy[0].id,
  monthBase: 10000,
  bonusMonth: 0,
  socialSecurityBase: 10000,
  providentFundBase: 10000,
  options: {
    rentalTaxRefund: true,
  },
})

const selectedCity = computed(() => {
  return UrbanPolicy.find(item => item.id === salaryInfo.value.selectedCity)!
})

const salaryCount = computed(() => {
  const personRate = selectedCity.value.insuranceData.injury[0]
    + selectedCity.value.insuranceData.unemployment[0]
    + selectedCity.value.insuranceData.maternity[0]
    + selectedCity.value.insuranceData.medical[0]
    + selectedCity.value.insuranceData.pension[0]

  const sh = salaryInfo.value.socialSecurityBase * personRate

  const ss = salaryInfo.value.providentFundBase * selectedCity.value.insuranceData.housingFund[0]

  const total = salaryInfo.value.monthBase * (12 + salaryInfo.value.bonusMonth)

  const annualTax = total - (sh + ss) * 12 - calculateAnnualPersonalIncomeTax(salaryInfo.value.monthBase * 12, salaryInfo.value.monthBase * salaryInfo.value.bonusMonth, 60000 + (sh + ss) * 12 + (salaryInfo.value.options.rentalTaxRefund ? (1500 * 12) : 0))

  return {
    total,
    annualTax,
    realIncome: annualTax + salaryInfo.value.providentFundBase * (selectedCity.value.insuranceData.housingFund[0] + selectedCity.value.insuranceData.housingFund[1]) * 12,
  }
})

function handleSyncClick() {
  salaryInfo.value.socialSecurityBase = salaryInfo.value.monthBase
  salaryInfo.value.providentFundBase = salaryInfo.value.monthBase
}
</script>

<template>
  <div py-4>
    <Fieldset legend="基本参数">
      <div class="py-4 grid grid-rows-4 md:grid-rows-2 gap-8 grid-cols-1 md:grid-cols-2 auto-rows-max">
        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.monthBase" prefix="¥ " label="213123" input-id="integeronly"
            :use-grouping="false" :min-fraction-digits="2" :max-fraction-digits="5" fluid w-full :min="0" :step="1000"
            show-buttons button-layout="horizontal"
          />
          <label for="username">月收入</label>
        </FloatLabel>

        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.bonusMonth" label="213123" input-id="integeronly"
            :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="1" fluid w-full :min="0" :step="0.5"
            show-buttons button-layout="horizontal"
            mode="decimal"
          />
          <label for="username">年终月数（独立计税）</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Select
              v-model="salaryInfo.selectedCity" :options="UrbanPolicy" option-value="id" option-label="name"
              w-full
            />
            <Button outlined @click="handleSyncClick">
              同步收入至基数
            </Button>
          </InputGroup>
          <label for="username">城市</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Button outlined>
              {{ selectedCity.insuranceData.ssBaseRange[0] }}
            </Button>
            <InputNumber
              v-model="salaryInfo.socialSecurityBase" :use-grouping="false" suffix=""
              input-id="withoutgrouping" w-full :min="selectedCity.insuranceData.ssBaseRange[0]"
              :max="selectedCity.insuranceData.ssBaseRange[1]"
            />
            <Button outlined>
              {{ selectedCity.insuranceData.ssBaseRange[1] }}
            </Button>
          </InputGroup>
          <label for="username">社保基数</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Button outlined>
              {{ selectedCity.insuranceData.shBaseRange[0] }}
            </Button>
            <InputNumber
              v-model="salaryInfo.providentFundBase" :use-grouping="false" suffix=""
              input-id="minmaxfraction" w-full :min="selectedCity.insuranceData.shBaseRange[0]"
              :max="selectedCity.insuranceData.shBaseRange[1]"
            />
            <Button outlined>
              {{ selectedCity.insuranceData.shBaseRange[1] }}
            </Button>
          </InputGroup>
          <label for="username">公积金基数</label>
        </FloatLabel>
      </div>
    </Fieldset>
    <Fieldset legend="收入">
      <div flex gap-4 py-4>
        <Card flex-1>
          <template #title>
            税前
          </template>
          <template #content>
            {{ salaryCount.total }}
          </template>
        </Card>
        <Card flex-1>
          <template #title>
            税后
          </template>
          <template #content>
            {{ salaryCount.annualTax }}
          </template>
        </Card>
        <Card flex-1>
          <template #title>
            总到手
          </template>
          <template #content>
            {{ salaryCount.realIncome }}
          </template>
        </Card>
      </div>
    </Fieldset>
    <Fieldset legend="个税附加扣除">
      <div class="py-4 grid grid-rows-4 md:grid-rows-2 gap-8 grid-cols-1 md:grid-cols-2 auto-rows-max">
        <ToggleButton
          v-model="salaryInfo.options.rentalTaxRefund" off-label="租房"
          :on-label="`租房：${selectedCity.insuranceData.rentalTaxRefund}`" on-icon="pi pi-check" off-icon="pi pi-times"
          aria-label="Confirmation"
        />
      </div>
    </Fieldset>
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
