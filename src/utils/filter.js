import {isOneDay, isOverdueDate, isRepeating} from '../utils/common.js';
import {FilterType} from '../const.js';

export const getArchieveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchieve);
};

export const getNotArchieveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchieve);
};

export const getFavoritesTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const date = new Date();

  switch (filterType) {

    case FilterType.ALL:
      return getNotArchieveTasks(tasks);

    case FilterType.ARCHIEVE:
      return getArchieveTasks(tasks);

    case FilterType.FAVORITES:
      return getFavoritesTasks(getNotArchieveTasks(tasks));

    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchieveTasks(tasks), date);

    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchieveTasks(tasks));

    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchieveTasks(tasks), date);

  }

  return tasks;
};
