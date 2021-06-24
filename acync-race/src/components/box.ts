import { BaseComponent } from './base-component';

export class Box extends BaseComponent {
  text: HTMLInputElement;

  color: HTMLInputElement;

  button: HTMLButtonElement;

  constructor(text: string, css?: string) {
    super('div', ['box']);
    this.text = document.createElement('input');
    this.text.type = 'text';
    this.color = document.createElement('input');
    this.color.type = 'color';
    this.button = document.createElement('button');
    this.button.innerHTML = text;
    this.button.classList.add('btn');
    this.element.append(this.text, this.color, this.button);
    if (css) this.element.classList.add(css);
  }
}
