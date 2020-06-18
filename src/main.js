import API from './api/index.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import BoardComponent from './components/board.js';
import BoardController from './controlers/board.js';
import FilterController from './controlers/filter.js';
import StatisticComponent from './components/statistic.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import TaskModel from './models/tasks.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic fjsdfuyh2c8#294yr2#^497&8ryc^74x9$ryb7yc3c4978@*&`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TaskModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
const statisticComponent = new StatisticComponent({tasks: tasksModel, dateFrom, dateTo});


const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, menuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveItem(MenuItem.TASKS);
      statisticComponent.hide();
      boardComponent.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTIC:
      menuComponent.setActiveItem(MenuItem.STATISTIC);
      boardComponent.hide();
      statisticComponent.show();
      break;
    case MenuItem.TASKS:
      menuComponent.setActiveItem(MenuItem.TASKS);
      statisticComponent.hide();
      boardComponent.show();
      break;
  }
});

apiWithProvider.getTasks()
    .then((tasks) => {
      tasksModel.setTasks(tasks);
      boardController.render();
    });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


