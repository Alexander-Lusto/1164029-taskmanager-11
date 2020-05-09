import BoardComponent from './components/board.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {render, RenderPosition} from './utils/render.js';
import BoardController from './controlers/board.js';
import TaskModel from './models/task.js';
import FilterController from './controlers/filter.js';
import StatisticComponent from './components/statistic.js';

const TASKS_COUNT = 100;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
render(siteHeaderElement, menuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASKS_COUNT);
const tasksModel = new TaskModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const statisticComponent = new StatisticComponent({tasks: tasksModel, dateFrom, dateTo});
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
