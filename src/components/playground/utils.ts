import type { SalaryInfo } from './shared'

interface TaxBracket {
  min: number
  max: number
  rate: number
  deduction: number
}

// 定义年度个税税率表
const annualTaxBrackets: TaxBracket[] = [
  { min: 0, max: 36000, rate: 0.03, deduction: 0 },
  { min: 36000, max: 144000, rate: 0.10, deduction: 2520 },
  { min: 144000, max: 300000, rate: 0.20, deduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
  { min: 420000, max: 660000, rate: 0.30, deduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 },
]

// 定义月度个税税率表（年终奖计税用）
const monthlyTaxBrackets: TaxBracket[] = [
  { min: 0, max: 3000, rate: 0.03, deduction: 0 },
  { min: 3000, max: 12000, rate: 0.10, deduction: 210 },
  { min: 12000, max: 25000, rate: 0.20, deduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 0.30, deduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 },
]

// 计算年度个人所得税函数
export function calculateAnnualPersonalIncomeTax(annualIncome: number, annualBonus: number = 0, deductions: number = 60000): number {
  // 1. 计算工资部分的税额
  const taxableIncome = annualIncome - deductions
  let salaryTax = 0

  if (taxableIncome > 0) {
    const bracket = annualTaxBrackets.find(bracket => taxableIncome > bracket.min && taxableIncome <= bracket.max)
    if (bracket) {
      salaryTax = taxableIncome * bracket.rate - bracket.deduction
    }
  }

  // 2. 计算年终奖金部分的税额
  let bonusTax = 0
  if (annualBonus > 0) {
    const avgMonthlyBonus = annualBonus / 12 // 计算年终奖月均收入
    const bonusBracket = monthlyTaxBrackets.find(bracket => avgMonthlyBonus > bracket.min && avgMonthlyBonus <= bracket.max)

    if (bonusBracket) {
      bonusTax = annualBonus * bonusBracket.rate - bonusBracket.deduction
    }
  }

  // 3. 返回工资税额和年终奖金税额的总和
  return Math.max(salaryTax + bonusTax, 0)
}

export function compressSalaryInfo(salaryInfo: SalaryInfo) {
  return {
    sc: salaryInfo.selectedCity,
    mb: salaryInfo.monthBase,
    tm: salaryInfo.totalMonth,
    ms: salaryInfo.monthSubsidy,
    bm: salaryInfo.bonusMonth,
    wod: salaryInfo.workOvertimeDays,
    ssb: salaryInfo.socialSecurityBase,
    pfb: salaryInfo.providentFundBase,
    id: salaryInfo.insuranceData,
    // options 压缩为紧凑的字符串形式
    opt: Object.values(salaryInfo.options)
      .map(([enabled, amount, months]) => `${+enabled},${amount},${months}`)
      .join(';'),
  }
}

export function decompressSalaryInfo(data: Record<string, any>) {
  const optionsKeys = [
    'rentalTaxRefund',
    'continuingEducation',
    'skillCertificate',
    'childEducation',
    'housingLoanInterest',
    'elderCare',
    'infantCare',
  ]

  return {
    selectedCity: data.sc,
    monthBase: data.mb,
    totalMonth: data.tm,
    monthSubsidy: data.ms,
    bonusMonth: data.bm,
    workOvertimeDays: data.wod,
    socialSecurityBase: data.ssb,
    providentFundBase: data.pfb,
    insuranceData: data.id,
    // 解压缩并解析 options 部分
    options: data.opt.split(';').reduce((acc: any, curr: any, index: number) => {
      const [enabled, amount, months] = curr.split(',').map(Number)
      acc[optionsKeys[index]] = [!!enabled, amount, months]
      return acc
    }, {} as SalaryInfo['options']),
  }
}
