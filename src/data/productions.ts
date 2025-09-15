import { Production, ProductionStats } from '../types';

export const productions: Production[] = [
  {
    id: '1',
    lineId: '1',
    productCode: 'P100.0001.CX24',
    productName: 'GUARAVITA NATURAL 290ML',
    technician: 'Lwruck@guaravita.com.br',
    startDate: '28/08/2025 - 05:48',
    status: 'EM PRODUCAO',
  },
  {
    id: '2',
    lineId: '1',
    productCode: 'P100.0001.CX24',
    productName: 'GUARAVITA NATURAL 290ML',
    technician: 'Lwruck@guaravita.com.br',
    startDate: '27/08/2025 - 05:58',
    endDate: '28/08/2025 - 05:20',
    status: 'FINALIZADA',
  },
  {
    id: '3',
    lineId: '1',
    productCode: 'P100.0001.CX24',
    productName: 'GUARAVITA NATURAL 290ML',
    technician: 'Fcorreia@guaravita.com.br',
    startDate: '25/09/2025 - 19:51',
    endDate: '26/09/2025 - 08:15',
    status: 'FINALIZADA',
  },
];

export const productionStats: ProductionStats = {
  operationHours: '17:25',
  productiveHours: '14:00',
  avgProduction: 6.5,
  totalProduced: 4082.0,
  hourlyProduction: [
    { hour: '00:00', value: 118 },
    { hour: '01:00', value: 0 },
    { hour: '02:00', value: 0 },
    { hour: '03:00', value: 0 },
    { hour: '04:00', value: 0 },
  ],
};