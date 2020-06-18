import TaskComponent from '../components/task.js';
import TaskModel from '../models/task.js';
import TaskEditorComponent from '../components/task-editor.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {Color, WEEK_DAYS} from '../const.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const parseFormData = (formData) => { // разобраться как работает
  const date = formData.get(`date`);
  const repeatingDays = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    'description': formData.get(`text`),
    'due_date': date ? new Date(date) : null,
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'color': formData.get(`color`),
    'is_favorite': false,
    'is_archived': false,
  });
};

export const EmptyTask = {
  color: Color.BLACK,
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  isArchive: false,
  isFavorite: false,
};

export default class TaskControler {
  constructor(container, onDataChange, onViewChange) {
    this._onViewChange = onViewChange;
    this._onDataChange = onDataChange;
    this._container = container;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    this._mode = mode;

    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditorComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);

      this._taskEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, task, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({
        deleteButtonText: `Deleting...`
      });

      this._onDataChange(this, task, null);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;

      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._onDataChange(this, task, newTask);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldTaskEditComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) { // возвращает Boolean значение, указывающее, является ли узел потомком данного узла,
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `ESC`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._taskEditComponent.getElement().querySelector(`.card--edit .card__inner`).style = `border: 1px solid red;`;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}


