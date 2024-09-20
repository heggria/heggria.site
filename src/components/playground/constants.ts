// 定义保险项类型
type InsuranceItem = [number, number]

// 定义所有保险项目的类型
export interface InsuranceData {
  baseRange: InsuranceItem // 基本范围
  pension: InsuranceItem // 养老保险
  medical: InsuranceItem // 医疗保险
  unemployment: InsuranceItem // 失业保险
  injury: InsuranceItem // 工伤保险
  maternity: InsuranceItem // 生育保险
  housingFund: InsuranceItem // 基本住房公积金
  supplementaryHousingFund: InsuranceItem // 补充住房公积金
  rentalTaxRefund: number // 租房退税额度
}

export const UrbanPolicy = [
  {
    id: 'BJ',
    group: 1,
    name: '北京',
    insuranceData: {
      shBaseRange: [2420, 35283],
      ssBaseRange: [6821, 35283],
      pension: [0.08, 0.16],
      medical: [0.02, 0.1],
      unemployment: [0.002, 0.008],
      injury: [0, 0.02],
      maternity: [0, 0.8],
      housingFund: [0.12, 0.12],
      supplementaryHousingFund: [0, 0],
      rentalTaxRefund: 1500,
    },
  },
  {
    id: 'SH',
    group: 1,
    name: '上海',
    insuranceData: {
      shBaseRange: [2690, 36921],
      ssBaseRange: [7384, 36921],
      pension: [0.08, 0.16],
      medical: [0.02, 0.1],
      unemployment: [0.005, 0.005],
      injury: [0, 0.0016],
      maternity: [0, 0.01],
      housingFund: [0.07, 0.07],
      supplementaryHousingFund: [0, 0],
      rentalTaxRefund: 1500,
    },
  },
]
