import AbstractComponent from './abstract-component.js';

const createLoadButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return createLoadButtonTemplate();
  }
  setClickHandler(callback) {
    this.getElement().addEventListener(`click`, callback);
  }
}
