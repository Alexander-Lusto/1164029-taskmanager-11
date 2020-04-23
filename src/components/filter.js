import AbstractComponent from './abstract-component.js';

const createFilterMarkup = (filter, isCheked) => {
  const {name, count} = filter;
  return (
    `<input
    type="radio"
    id="filter__${name}"
    class="filter__input visually-hidden"
    name="filter"
    ${isCheked ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
  />
  <label for="filter__${name}" class="filter__label">
    ${name} <span class="filter__${name}-count">${count}</span></label
  >`
  );
};

const createFilterTemplate = (filters) => {

  const filtersMurkup = filters.map((it, i) => {
    return createFilterMarkup(it, i === 0);
  }).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMurkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
