import { BaseComponent } from '../components/base-component';

export class Navigation extends BaseComponent {
  constructor() {
    super('header', []);

    this.element.innerHTML = `
    <div class="container">
    <div class="nav">
    <nav>
      <ul class="navigation">
          <a href="#garage" class="active"><li>Garage</li></a>
          <a href="#winners" id="best-score"><li>Winners</li></a>
      </ul>
    </nav>
    </div>
    </div>
    `;
    const links = this.element.querySelectorAll('a');

    links.forEach((element) => {
      element.addEventListener('click', () => {
        links?.forEach((item) => {
          item.classList.remove('active');
        });
        element.classList.add('active');
      });
    });
  }
}
