import { getCar, getWinners } from '../api';
import { BaseComponent } from '../components/base-component';
import { Button } from '../components/button';
import { Winner } from '../models/winner.model';
import store from '../store';
import { WinnerView } from './winner.view';

export class WinnersView extends BaseComponent {
  header: BaseComponent;

  tableHeader: BaseComponent;

  list: BaseComponent;

  prevBtn: Button;

  nextBtn: Button;

  pagination: BaseComponent;

  form: BaseComponent;

  constructor() {
    super('div', ['container', 'page']);
    this.prevBtn = new Button('<');
    this.nextBtn = new Button('>');
    this.pagination = new BaseComponent('div', ['pagination']);
    this.pagination
      .getElement()
      .append(this.prevBtn.getElement(), this.nextBtn.getElement());
    this.form = new BaseComponent('div', ['add-form']);
    this.form
      .getElement()
      .append(new BaseComponent().getElement(), this.pagination.getElement());
    this.header = new BaseComponent('div', ['header']);
    this.tableHeader = new BaseComponent('div', [
      'header',
      'table-header',
      'row',
    ]);
    this.tableHeader.getElement().innerHTML = `
    <h4 class="sort" id="id">#</h4>
    <h4>Car</h4>
    <h4>Name</h4>
    <h4 class="sort" id="wins">Wins</h4>
    <h4 class="sort asc" id="time">Best Time</h4>`;
    this.list = new BaseComponent();
    this.element.append(
      this.header.getElement(),
      this.form.getElement(),
      this.tableHeader.getElement(),
      this.list.getElement(),
    );
  }

  init() {
    this.render();
    this.nextBtn.getElement().addEventListener('click', async () => {
      store.pageWinners++;
      this.render();
    });
    this.prevBtn.getElement().addEventListener('click', async () => {
      store.pageWinners--;
      this.render();
    });
    const columns = this.element.querySelectorAll('.sort');

    columns.forEach((element) => {
      element.addEventListener('click', () => {
        let order = 'asc';
        if (element.classList.contains('asc')) {
          order = 'desc';
        }
        columns?.forEach((item) => {
          item.classList.remove('asc', 'desc');
        });
        element.classList.add(order);
        store.order = order.toUpperCase();
        store.sort = element.id;
        this.render();
      });
    });
  }

  async render() {
    const { items: winners, count: winnersCount } = await getWinners(
      store.pageWinners, 10, store.order, store.sort,
    );
    this.header.getElement().innerHTML = `<h3>Winners (${winnersCount})</h3><h3>Page #${store.pageWinners}</h3>`;
    this.list.getElement().innerHTML = '';
    winners.forEach(async (element: Winner) => {
      const car = await getCar(element.id);
      const winner = new WinnerView(element, car);
      this.list.getElement().append(winner.getElement());
    });
    if (store.pageWinners * 10 > Number(winnersCount)) {
      this.nextBtn.getElement().classList.add('invalid');
    } else {
      this.nextBtn.getElement().classList.remove('invalid');
    }
    if (store.pageWinners > 1) {
      this.prevBtn.getElement().classList.remove('invalid');
    } else {
      this.prevBtn.getElement().classList.add('invalid');
    }
  }
}
