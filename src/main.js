import API from './api.js';
import BoardComponent from './components/board.js';
import BoardController from './controlers/board.js';
import FilterController from './controlers/filter.js';
import StatisticComponent from './components/statistic.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import TaskModel from './models/tasks.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic fjsdfuyh2c8#294yr2#^497&8ryc^74x9$ryb7yc3c4978@*&`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const tasksModel = new TaskModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
const statisticComponent = new StatisticComponent({tasks: tasksModel, dateFrom, dateTo});


const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, api);
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

api.getTasks()
    .then((tasks) => {
      tasksModel.setTasks(tasks);
      boardController.render();
    });
