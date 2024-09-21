import type { Policy } from './shared'

export const UrbanPolicy: Policy[] = [
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
      maternity: [0, 0.008],
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
