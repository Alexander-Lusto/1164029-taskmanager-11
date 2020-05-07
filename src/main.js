import BoardComponent from './components/board.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {render, RenderPosition} from './utils/render.js';
import BoardController from './controlers/board.js';
import TaskModel from './models/task.js';
import FilterController from './controlers/filter.js';

const TASKS_COUNT = 22;

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

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});

