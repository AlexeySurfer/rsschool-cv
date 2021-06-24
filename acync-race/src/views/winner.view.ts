import { BaseComponent } from '../components/base-component';
import { Winner } from '../models/winner.model';
import { CarImg } from '../components/car-img';
import { Car } from '../models/car.model';

export class WinnerView extends BaseComponent {
  constructor(winner: Winner, car: Car) {
    super('div', ['row', 'winner']);
    const pic = new CarImg(car.color);
    const number = new BaseComponent('div', ['number']);
    number.getElement().innerHTML = `${winner.id}`;
    const name = new BaseComponent('div');
    name.getElement().innerHTML = `${car.name}`;
    const wins = new BaseComponent('div');
    wins.getElement().innerHTML = `${winner.wins}`;
    const time = new BaseComponent('div');
    time.getElement().innerHTML = `${winner.time}`;
    this.element.append(
      number.getElement(),
      pic.getElement(),
      name.getElement(),
      wins.getElement(),
      time.getElement(),
    );
  }
}
