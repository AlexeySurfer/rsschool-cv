import {
  createCar,
  getGarage,
  updateCar,
} from '../api';
import { BaseComponent } from '../components/base-component';
import { Car } from '../models/car.model';
import store from '../store';
import { Box } from '../components/box';
import { Button } from '../components/button';
import { CarView } from './car.view';
import { addWinRecord } from '../shared/util';

export class GarageView extends BaseComponent {
  list: BaseComponent;

  header: BaseComponent;

  addForm: BaseComponent;

  pagination: BaseComponent;

  rasePanel: BaseComponent;

  createBox: Box;

  modifyBox: Box;

  prevBtn: Button;

  nextBtn: Button;

  raceBtn: Button;

  resetBtn: Button;

  cars: CarView[] | undefined;

  constructor() {
    super('div', ['container', 'page']);
    this.header = new BaseComponent('div', ['header']);
    this.element.append(this.header.getElement());
    this.addForm = new BaseComponent('div', ['add-form']);
    this.createBox = new Box('create');
    this.modifyBox = new Box('update', 'invalid');
    this.prevBtn = new Button('<');
    this.nextBtn = new Button('>');
    this.rasePanel = new BaseComponent('div', ['rase-box']);
    this.raceBtn = new Button('race');
    this.resetBtn = new Button('reset');
    this.rasePanel
      .getElement()
      .append(this.raceBtn.getElement(), this.resetBtn.getElement());
    this.pagination = new BaseComponent('div', ['pagination']);
    this.pagination
      .getElement()
      .append(this.prevBtn.getElement(), this.nextBtn.getElement());
    this.addForm
      .getElement()
      .append(
        this.createBox.getElement(),
        this.modifyBox.getElement(),
        this.rasePanel.getElement(),
        this.pagination.getElement(),
      );
    this.element.append(this.addForm.getElement());
    this.list = new BaseComponent('div', ['garage']);
    this.element.append(this.list.getElement());
  }

  init() {
    this.render();
    const addBtn = this.createBox.button;
    const updBtn = this.modifyBox.button;
    const model = this.createBox.text;
    const { color } = this.createBox;
    const mmodel = this.modifyBox.text;
    const mcolor = this.modifyBox.color;
    addBtn.addEventListener('click', async () => {
      await createCar({ color: color?.value ?? '', name: model?.value ?? '' });
      this.render();
    });
    updBtn.addEventListener('click', async () => {
      await updateCar(Number(updBtn.dataset.id), {
        color: mcolor.value,
        name: mmodel.value,
      });
      this.render();
      this.modifyBox.getElement().classList.add('invalid');
      mcolor.value = '#FFF';
      mmodel.value = '';
    });
    this.nextBtn.getElement().addEventListener('click', async () => {
      store.page++;
      this.render();
    });
    this.prevBtn.getElement().addEventListener('click', async () => {
      store.page--;
      this.render();
    });
    this.raceBtn.getElement().addEventListener('click', async () => {
      this.raceBtn.getElement().classList.add('invalid');
      const del = this.cars?.map((el) => el.setDelay());
      if (del) {
        await Promise.all(del);
      }
      const time = this.cars?.map((el) => el.race());
      if (time) {
        await Promise.all(time).then(async (val) => {
          const t = val.map((el) => el.time);
          if (val) {
            const min = Math.min(...t);
            const recod = Math.ceil(min * 1000) / 1000;
            const winner = val.filter((el) => el.time === min);
            if (recod === 40) {
              alert('All engines was broken..');
              return;
            }
            alert(`Race is finished with best time: ${recod} sec. Winner: ${winner[0].name}`);
            const { id } = winner[0];
            addWinRecord(id, recod);
          }
        });
      }
    });
    this.resetBtn.getElement().addEventListener('click', () => {
      this.cars?.forEach((car) => {
        car.reset();
      });
      this.raceBtn.getElement().classList.remove('invalid');
    });
  }

  async render() {
    const { items: cars, count: garageCapasity } = await getGarage(store.page);
    this.cars = [];
    store.cars = cars;
    store.garageCapasity = garageCapasity;
    this.header.getElement().innerHTML = `<h3>Garage (${store.garageCapasity})</h3><h3>Page #${store.page}</h3>`;
    this.list.getElement().innerHTML = '';
    store.cars.forEach((element: Car) => {
      const car = new CarView(element, this);
      this.list.getElement().append(car.getElement());
      this.cars?.push(car);
    });
    if (store.page * 7 > Number(store.garageCapasity)) {
      this.nextBtn.getElement().classList.add('invalid');
    } else {
      this.nextBtn.getElement().classList.remove('invalid');
    }
    if (store.page > 1) {
      this.prevBtn.getElement().classList.remove('invalid');
    } else {
      this.prevBtn.getElement().classList.add('invalid');
    }
  }

  setUpdateBox(car: Car) {
    const box = this.modifyBox.getElement();
    const model = this.modifyBox.text;
    const { color } = this.modifyBox;
    const updBtn = this.modifyBox.button;
    box.classList.remove('invalid');
    model.value = car.name;
    color.value = car.color;
    updBtn.dataset.id = String(car.id);
  }
}
