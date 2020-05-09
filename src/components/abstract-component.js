import {createElement} from '../utils/render.js';

const CLASS_TO_HIDE = `visually-hidden`;

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate.`);
  }


  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(CLASS_TO_HIDE);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(CLASS_TO_HIDE);
    }
  }
}
