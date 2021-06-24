import {
  deleteCar, deleteWinner, drive, start, stop,
} from '../api';
import { BaseComponent } from '../components/base-component';
import { Car } from '../models/car.model';
import { Button } from '../components/button';
import { CarImg } from '../components/car-img';
import { GarageView } from './garage.view';

export class CarView extends BaseComponent {
  start: Button;

  stop: Button;

  delete: Button;

  select: Button;

  pic: CarImg;

  car: Car;

  delay: number;

  constructor(car: Car, garage: GarageView) {
    super('div', ['row']);
    this.car = car;
    this.delay = 0;
    this.start = new Button('a');
    this.stop = new Button('b', 'invalid');
    this.delete = new Button('delete');
    this.select = new Button('select');
    this.pic = new CarImg(car.color);
    const p = new BaseComponent();
    p.getElement().innerHTML = car.name;
    const transmission = new BaseComponent('div', ['transmission']);
    const finish = new BaseComponent();
    transmission
      .getElement()
      .append(
        this.start.getElement(),
        this.stop.getElement(),
        this.delete.getElement(),
        this.select.getElement(),
      );
    finish.getElement().innerHTML = '<img class="finish" src="./finish.svg" alt="finish">';
    const rase = new BaseComponent('div', ['rase']);
    rase.getElement().append(this.pic.getElement());
    rase.getElement().append(finish.getElement());
    this.element.appendChild(p.getElement());
    this.element.appendChild(transmission.getElement());
    this.element.appendChild(rase.getElement());

    this.start.getElement().addEventListener('click', async () => {
      this.start.getElement().classList.add('invalid');
      this.stop.getElement().classList.remove('invalid');
      const response = await start(this.car.id);
      this.pic.getElement().style.animation = `simple ${
        response.distance / (response.velocity * 1000)
      }s forwards ease`;
      const driveRes = await drive(this.car.id);
      if (driveRes.success === false) {
        this.pic.getElement().style.animationPlayState = 'paused';
      }
    });
    this.stop.getElement().addEventListener('click', async () => {
      const response = await stop(this.car.id);
      if (response.velocity === 0) {
        this.pic.getElement().style.animation = '';
        this.start.getElement().classList.remove('invalid');
        this.stop.getElement().classList.add('invalid');
      }
    });
    this.delete.getElement().addEventListener('click', async () => {
      await deleteCar(this.car.id);
      deleteWinner(this.car.id);
      garage.render();
    });
    this.select.getElement().addEventListener('click', async () => {
      garage.setUpdateBox(this.car);
    });
  }

  async setDelay() {
    this.start.getElement().classList.add('invalid');
    this.stop.getElement().classList.remove('invalid');
    const response = await start(this.car.id);
    this.delay = response.distance / (response.velocity * 1000);
  }

  async race() {
    this.pic.getElement().style.animation = `simple ${this.delay}s forwards ease`;
    const driveRes = await drive(this.car.id);
    if (driveRes.success === false) {
      this.pic.getElement().style.animationPlayState = 'paused';
      return { time: 40, id: this.car.id, name: this.car.name };
    }

    return { time: this.delay, id: this.car.id, name: this.car.name };
  }

  reset() {
    stop(this.car.id);
    this.pic.getElement().style.animation = '';
    this.start.getElement().classList.remove('invalid');
    this.stop.getElement().classList.add('invalid');
  }

  resetAnimarion() {
    this.pic.getElement().style.animation = '';
  }
}
