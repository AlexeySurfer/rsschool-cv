import { BaseComponent } from './base-component';

export class Button extends BaseComponent {
  constructor(text: string, css?: string) {
    super('button', ['btn']);
    this.element.innerHTML = `${text}`;
    if (css) this.element.classList.add(css);
  }
}
