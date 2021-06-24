import { getGarage } from './api';

const { items: cars, count: garageCapasity } = await getGarage();
export default {
  page: 1,
  cars,
  garageCapasity,
  pageWinners: 1,
  order: 'ASC',
  sort: 'time',
};
