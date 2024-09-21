// 定义保险项类型
type InsuranceItem = [number, number]

// 定义所有保险项目的类型
export interface InsuranceData extends Record<string, any> {
  shBaseRange: InsuranceItem // 基本范围
  ssBaseRange: InsuranceItem // 基本范围
  pension: InsuranceItem // 养老保险
  medical: InsuranceItem // 医疗保险
  unemployment: InsuranceItem // 失业保险
  injury: InsuranceItem // 工伤保险
  maternity: InsuranceItem // 生育保险
  housingFund: InsuranceItem // 基本住房公积金
  supplementaryHousingFund: InsuranceItem // 补充住房公积金
  rentalTaxRefund: number // 租房退税额度
}

export interface Policy {
  id: string
  group: number
  name: string
  insuranceData: InsuranceData
}

type Option = [boolean, number, number]

export interface SalaryInfo {
  selectedCity: string
  monthBase: number
  totalMonth: number
  monthSubsidy: number
  bonusMonth: number
  workOvertimeDays: number
  socialSecurityBase: number
  providentFundBase: number
  insuranceData: InsuranceData
  options: {
    rentalTaxRefund: Option
    continuingEducation: Option
    skillCertificate: Option
    childEducation: Option
    housingLoanInterest: Option
    elderCare: Option
    infantCare: Option
  } & Record<string, any>
}
