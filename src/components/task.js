import {formatTime, formatDate, isOverdueDate} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import {encode} from 'he';

const createTaskTemplate = (task) => {
  const {description: insecureDescription, color, dueDate, repeatingDays, isArchieve, isFavorite} = task;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isDateShowing = !!dueDate;

  const description = encode(insecureDescription);
  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const archieveButtonInactiveClass = isArchieve ? `` : `card__btn--disabled`;
  const favoriteButtonInactiveClass = isFavorite ? `` : `card__btn--disabled`;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass} ">
            <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
                  <button type="button" class="card__btn card__btn--archive ${archieveButtonInactiveClass}">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites ${favoriteButtonInactiveClass}"
                  >
                    favorites
                  </button>
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <p class="card__text">${description}</p>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <div class="card__date-deadline">
                        <p class="card__input-deadline-wrap">
                          <span class="card__date">${date}</span>
                          <span class="card__time">${time}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>`
  );
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(callback) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, callback);
  }

  setArchieveButtonClickHandler(callback) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, callback);
  }

  setFavoriteButtonClickHandler(callback) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, callback);
  }
}
