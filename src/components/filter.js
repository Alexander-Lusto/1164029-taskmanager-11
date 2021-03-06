import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

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

  const filtersMurkup = filters.map((it) => {
    return createFilterMarkup(it, it.checked);
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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
