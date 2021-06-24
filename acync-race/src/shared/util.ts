import {
  createWinner, getWinner, getWinnerStatus, updateWinner,
} from '../api';

export function getRaceWidth(element: Element) {
  const styles = window.getComputedStyle(element);
  const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  return element.clientWidth - padding - 100;
}

export async function addWinRecord(id: number, recod: number) {
  const winnerStatus = await getWinnerStatus(id);
  const winnerData = await getWinner(id);
  if (winnerStatus !== 404) {
    updateWinner(id, {
      id,
      wins: winnerData.wins + 1,
      time: recod < winnerData.time ? recod : winnerData.time,
    });
  } else {
    createWinner({ id, time: recod, wins: 1 });
  }
}
