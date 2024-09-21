<script setup lang="ts">
import { UrbanPolicy } from './constants'
import type { SalaryInfo } from './shared'
import { calculateAnnualPersonalIncomeTax, compressSalaryInfo, decompressSalaryInfo } from './utils'

const { copy, copied, isSupported } = useClipboard()
function copyUrl() {
  const url = location.href
  copy(url)
}

const defaultValue: SalaryInfo = {
  selectedCity: UrbanPolicy[0].id,
  monthBase: 10000,
  totalMonth: 12,
  monthSubsidy: 0,
  bonusMonth: 0,
  workOvertimeDays: 0,
  socialSecurityBase: 10000,
  providentFundBase: 10000,
  insuranceData: UrbanPolicy[0].insuranceData,
  options: {
    rentalTaxRefund: [true, 1500, 12],
    continuingEducation: [false, 400, 12],
    skillCertificate: [false, 3600, 1],
    childEducation: [false, 2000, 12],
    housingLoanInterest: [false, 1000, 12],
    elderCare: [false, 3000, 12],
    infantCare: [false, 2000, 12],
  },
}

const salaryInfo = ref<SalaryInfo>(defaultValue)
// 生成 URL Base64 参数
function generateUrlParam() {
  const encoded = btoa(encodeURIComponent(JSON.stringify(compressSalaryInfo(salaryInfo.value))))
  return `?salaryInfo=${encoded}`
}

// 解析 URL 参数并设置 salaryInfo
function setSalaryInfoFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const encodedInfo = params.get('salaryInfo')
  if (encodedInfo) {
    try {
      const decoded = decodeURIComponent(atob(encodedInfo))
      const parsedInfo = decompressSalaryInfo(JSON.parse(decoded))
      salaryInfo.value = { ...salaryInfo.value, ...parsedInfo }
    }
    catch (error) {
      console.error('解析 salaryInfo URL 参数时出错:', error)
    }
  }
}

// 将数据变化同步到 URL，不影响 history
function syncSalaryInfoToUrl() {
  const newUrlParam = generateUrlParam()
  const newUrl = `${window.location.pathname}${newUrlParam}`
  window.history.replaceState({}, '', newUrl)
}

// 监听 salaryInfo 的变化
watch(salaryInfo, () => {
  syncSalaryInfoToUrl()
}, { deep: true })

onMounted(() => {
  setSalaryInfoFromUrl()
})

const selectedCity = computed(() => {
  return UrbanPolicy.find(item => item.id === salaryInfo.value.selectedCity)!
})

const salaryCount = computed(() => {
  const personRate = salaryInfo.value.insuranceData.injury[0]
    + salaryInfo.value.insuranceData.unemployment[0]
    + salaryInfo.value.insuranceData.maternity[0]
    + salaryInfo.value.insuranceData.medical[0]
    + salaryInfo.value.insuranceData.pension[0]

  const sh = salaryInfo.value.socialSecurityBase * personRate

  const ss = salaryInfo.value.providentFundBase * salaryInfo.value.insuranceData.housingFund[0]

  const personCount = (salaryInfo.value.monthBase + salaryInfo.value.monthBase / 21.75 * salaryInfo.value.workOvertimeDays + salaryInfo.value.monthSubsidy) * salaryInfo.value.totalMonth
  const boundCount = salaryInfo.value.monthBase * salaryInfo.value.bonusMonth * salaryInfo.value.totalMonth / 12
  const total = personCount + boundCount

  const revertTax = Object.values(salaryInfo.value.options).reduce((total, [isSelected, amount, months]) => {
    return total + (isSelected ? amount * months : 0)
  }, 0)

  const annualTax = total - (sh + ss) * salaryInfo.value.totalMonth - calculateAnnualPersonalIncomeTax(personCount, boundCount, 60000 + (sh + ss) * salaryInfo.value.totalMonth + revertTax)

  const elderlyCareCount = salaryInfo.value.socialSecurityBase * salaryInfo.value.insuranceData.pension[0] * salaryInfo.value.totalMonth
  const healthInsuranceCount = salaryInfo.value.socialSecurityBase * salaryInfo.value.insuranceData.medical[0] * salaryInfo.value.totalMonth
  const providentFundCount = salaryInfo.value.providentFundBase * (salaryInfo.value.insuranceData.housingFund[0] + salaryInfo.value.insuranceData.housingFund[1]) * salaryInfo.value.totalMonth

  return {
    total,
    annualTax,
    realIncome: annualTax + salaryInfo.value.providentFundBase * (salaryInfo.value.insuranceData.housingFund[0] + salaryInfo.value.insuranceData.housingFund[1]) * salaryInfo.value.totalMonth,
    elderlyCareCount,
    healthInsuranceCount,
    providentFundCount,
  }
})

function handleSyncClick() {
  salaryInfo.value.socialSecurityBase = Math.max(Math.min(salaryInfo.value.monthBase, selectedCity.value.insuranceData.ssBaseRange[1]), selectedCity.value.insuranceData.ssBaseRange[0])
  salaryInfo.value.providentFundBase = Math.max(Math.min(salaryInfo.value.monthBase, selectedCity.value.insuranceData.shBaseRange[1]), selectedCity.value.insuranceData.shBaseRange[0])
}

function handleCityChange() {
  salaryInfo.value.socialSecurityBase = 10000
  salaryInfo.value.providentFundBase = 10000
  salaryInfo.value.insuranceData = selectedCity.value.insuranceData
  salaryInfo.value.options.rentalTaxRefund[1] = selectedCity.value.insuranceData.rentalTaxRefund
}
</script>

<template>
  <div>
    <Fieldset legend="基本参数">
      <div class="pt-4 grid grid-rows-4 md:grid-rows-2 gap-8 grid-cols-1 md:grid-cols-2 auto-rows-max">
        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.monthBase" prefix="¥ " :use-grouping="false" :min-fraction-digits="0"
            :max-fraction-digits="2" fluid w-full :min="0" :step="1000" show-buttons button-layout="horizontal"
          />
          <label for="username">月 base</label>
        </FloatLabel>

        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.totalMonth" :use-grouping="false" :min-fraction-digits="0"
            :max-fraction-digits="1" fluid w-full :min="0" :max="12" :step="0.5" show-buttons button-layout="horizontal"
            mode="decimal"
          />
          <label for="username">计薪月数（该年度在公司的月数）</label>
        </FloatLabel>

        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.bonusMonth" :use-grouping="false" :min-fraction-digits="0"
            :max-fraction-digits="1" fluid w-full :min="0" :step="0.5" show-buttons button-layout="horizontal"
            mode="decimal"
          />
          <label for="username">年终月数（独立计税）</label>
        </FloatLabel>

        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.workOvertimeDays" :use-grouping="false" :min-fraction-digits="0"
            :max-fraction-digits="1" fluid w-full :min="0" :step="0.5" show-buttons button-layout="horizontal"
            mode="decimal"
          />
          <label for="username">月加班天数（几倍工资计几天）</label>
        </FloatLabel>

        <FloatLabel>
          <InputNumber
            v-model="salaryInfo.monthSubsidy" prefix="¥ " :use-grouping="false" :min-fraction-digits="0"
            :max-fraction-digits="2" fluid w-full :min="0" :step="100" show-buttons
            button-layout="horizontal"
          />
          <label for="username">月补贴</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Select
              v-model="salaryInfo.selectedCity" :options="UrbanPolicy" option-value="id" option-label="name"
              w-full @change="handleCityChange"
            />
            <Button outlined @click="handleSyncClick">
              同步 base 至基数
            </Button>
          </InputGroup>
          <label for="username">城市</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Button outlined @click="salaryInfo.socialSecurityBase = selectedCity.insuranceData.ssBaseRange[0]">
              {{ selectedCity.insuranceData.ssBaseRange[0] }}
            </Button>
            <InputNumber
              v-model="salaryInfo.socialSecurityBase" :use-grouping="false" suffix=""
              input-id="withoutgrouping" w-full :min="selectedCity.insuranceData.ssBaseRange[0]"
              :max="selectedCity.insuranceData.ssBaseRange[1]"
            />
            <Button outlined @click="salaryInfo.socialSecurityBase = selectedCity.insuranceData.ssBaseRange[1]">
              {{ selectedCity.insuranceData.ssBaseRange[1] }}
            </Button>
          </InputGroup>
          <label for="username">社保基数</label>
        </FloatLabel>

        <FloatLabel>
          <InputGroup>
            <Button outlined @click="salaryInfo.providentFundBase = selectedCity.insuranceData.shBaseRange[0]">
              {{ selectedCity.insuranceData.shBaseRange[0] }}
            </Button>
            <InputNumber
              v-model="salaryInfo.providentFundBase" :use-grouping="false" suffix=""
              input-id="minmaxfraction" w-full :min="selectedCity.insuranceData.shBaseRange[0]"
              :max="selectedCity.insuranceData.shBaseRange[1]"
            />
            <Button outlined @click="salaryInfo.providentFundBase = selectedCity.insuranceData.shBaseRange[1]">
              {{ selectedCity.insuranceData.shBaseRange[1] }}
            </Button>
          </InputGroup>
          <label for="username">公积金基数</label>
        </FloatLabel>
      </div>
    </Fieldset>
    <Fieldset legend="险金比例（个人-公司）">
      <div class="py-4 grid grid-rows-3 md:grid-rows-2 gap-8 grid-cols-2 md:grid-cols-3 auto-rows-max">
        <DigitsInput v-model="salaryInfo.insuranceData.housingFund" label="公积金" />
        <DigitsInput v-model="salaryInfo.insuranceData.pension" label="养老" />
        <DigitsInput v-model="salaryInfo.insuranceData.medical" label="医保" />
        <DigitsInput v-model="salaryInfo.insuranceData.maternity" label="生育" />
        <DigitsInput v-model="salaryInfo.insuranceData.injury" label="工伤" />
        <DigitsInput v-model="salaryInfo.insuranceData.unemployment" label="失业" />
      </div>
    </Fieldset>
    <Fieldset legend="收入">
      <div class="grid grid-rows-3 md:grid-rows-2 gap-4 grid-cols-2 md:grid-cols-3 auto-rows-max">
        <Card>
          <template #title>
            税前
          </template>
          <template #content>
            {{ salaryCount.total.toFixed(2) }}
          </template>
        </Card>
        <Card>
          <template #title>
            税后
          </template>
          <template #content>
            {{ salaryCount.annualTax.toFixed(2) }}
          </template>
        </Card>
        <Card>
          <template #title>
            税后+公积金
          </template>
          <template #content>
            {{ salaryCount.realIncome.toFixed(2) }}
          </template>
        </Card>
        <Card>
          <template #title>
            养老个账
          </template>
          <template #content>
            {{ salaryCount.elderlyCareCount.toFixed(2) }}
          </template>
        </Card>
        <Card>
          <template #title>
            医保个账
          </template>
          <template #content>
            {{ salaryCount.healthInsuranceCount.toFixed(2) }}
          </template>
        </Card>
        <Card>
          <template #title>
            公积金个账
          </template>
          <template #content>
            {{ salaryCount.providentFundCount.toFixed(2) }}
          </template>
        </Card>

        <Button v-if="isSupported" class="col-span-2 md:col-span-3" :severity="copied ? 'success' : 'secondary'" raised @click="copyUrl">
          {{ copied ? '复制成功' : '复制分享链接' }}
        </Button>
      </div>
    </Fieldset>
    <Fieldset legend="个税附加扣除">
      <div class="grid grid-rows-4 md:grid-rows-2 gap-4 grid-cols-1 md:grid-cols-2 auto-rows-max">
        <ToggleButton
          v-model="salaryInfo.options.rentalTaxRefund[0]" off-label="租房"
          :on-label="`住房租金：${salaryInfo.options.rentalTaxRefund[1]} * ${salaryInfo.options.rentalTaxRefund[2]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.continuingEducation[0]" off-label="继续教育"
          :on-label="`继续教育：${salaryInfo.options.continuingEducation[1]} * ${salaryInfo.options.continuingEducation[2]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.skillCertificate[0]" off-label="技能证书"
          :on-label="`技能证书：${salaryInfo.options.skillCertificate[1]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.childEducation[0]" off-label="子女教育"
          :on-label="`子女教育：${salaryInfo.options.childEducation[1]}  * ${salaryInfo.options.childEducation[2]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.housingLoanInterest[0]" off-label="住房贷款利息"
          :on-label="`住房贷款利息：${salaryInfo.options.housingLoanInterest[1]}  * ${salaryInfo.options.housingLoanInterest[2]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.elderCare[0]" off-label="赡养老人"
          :on-label="`赡养老人：${salaryInfo.options.elderCare[1]}  * ${salaryInfo.options.elderCare[2]}`"
        />
        <ToggleButton
          v-model="salaryInfo.options.infantCare[0]" off-label="婴幼儿照护"
          :on-label="`婴幼儿照护：2000 * ${salaryInfo.totalMonth}`"
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
