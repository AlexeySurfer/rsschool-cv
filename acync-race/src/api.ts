import { CarDTO } from './models/carDTO';
import { WinnerDTO } from './models/winnerDTO';

const apiUrl = 'http://127.0.0.1:3000/';
const garage = `${apiUrl}garage`;
const winners = `${apiUrl}winners`;
const engine = `${apiUrl}engine`;

export const getGarage = async (page = 1, limit = 7) => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await response.json(),
    count: response.headers.get('X-Total-Count'),
  };
};

export const createCar = async (body: CarDTO) => (
  await fetch(garage, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const updateCar = async (id: number, body: CarDTO) => (
  await fetch(`${garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const deleteCar = async (id: number) => (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();

export const getCar = async (id: number) => (await fetch(`${garage}/${id}`)).json();

export const getWinners = async (
  page = 1,
  limit = 10,
  order = 'ASC',
  sort = 'time',
) => {
  const response = await fetch(
    `${winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
  );
  const body = await response.json();
  return {
    items: body,
    count: response.headers.get('X-Total-Count'),
  };
};

export const start = async (id: number) => (await fetch(`${engine}?id=${id}&status=started`)).json();

export const stop = async (id: number) => (await fetch(`${engine}?id=${id}&status=stopped`)).json();

export const drive = async (id: number) => {
  const response = await fetch(`${engine}?id=${id}&status=drive`).catch();
  if (response.status !== 200) {
    return { success: false };
  }
  return { ...(await response.json()) };
};

export const createWinner = async (body: WinnerDTO) => (
  await fetch(winners, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const getWinner = async (id: number) => (await fetch(`${winners}/${id}`)).json();

export const getWinnerStatus = async (id: number) => (await fetch(`${winners}/${id}`)).status;

export const updateWinner = async (id: number, body: WinnerDTO) => (
  await fetch(`${winners}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const deleteWinner = async (id: number) => (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();
