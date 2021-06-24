import { GarageView } from './views/garage.view';
import { BaseComponent } from './components/base-component';
import { Navigation } from './views/navigation.view';
import { WinnersView } from './views/winners.view';
import { getRaceWidth } from './shared/util';

export class App {
  private garage: GarageView;

  private winners: WinnersView;

  private readonly navigation: Navigation;

  private page: BaseComponent = new BaseComponent();

  constructor(private readonly rootElement: HTMLElement) {
    this.garage = new GarageView();
    this.navigation = new Navigation();
    this.winners = new WinnersView();
    this.rootElement.appendChild(this.navigation.getElement());
    this.rootElement.appendChild(this.page.getElement());
    this.page.getElement().appendChild(this.garage.getElement());
    this.garage.init();
    this.winners.init();
    document.documentElement.style.setProperty(
      '--race',
      `${getRaceWidth(
        this.page.getElement().firstElementChild ?? this.page.getElement(),
      )}px`,
    );

    window.onresize = () => {
      document.documentElement.style.setProperty(
        '--race',
        `${getRaceWidth(
          this.page.getElement().firstElementChild ?? this.page.getElement(),
        )}px`,
      );
    };
  }

  renderGarage() {
    this.page.getElement().innerHTML = '';
    this.garage.cars?.forEach((car) => car.resetAnimarion());
    this.page.getElement().appendChild(this.garage.getElement());
  }

  renderScore() {
    this.page.getElement().innerHTML = '';
    this.winners.render();
    this.page.getElement().appendChild(this.winners.getElement());
  }
}
