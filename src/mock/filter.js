const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archieve`];

const generateFilters = (tasksArray) => {
  return filterNames.map((it, i) => {
    return {
      name: it,
      count: calculateCount(filterNames[i], tasksArray),
    };
  });
};

const calculateCount = (filterName, tasksArray) => {
  let count;
  const date = new Date();

  switch (filterName) {
    case `all`:
      count = tasksArray.length;
      break;
    case `overdue`:
      count = tasksArray.filter((it) => it.dueDate instanceof Date && it.dueDate < date).length;
      break;
    case `today`:
      count = tasksArray.filter((it) => it.dueDate instanceof Date && it.dueDate.getDate() === date.getDate()).length;
      break;
    case `favorites`:
      count = tasksArray.filter((it) => it.isFavorite === true).length;
      break;
    case `repeating`:
      count = tasksArray.filter((it) => Object.values(it.repeatingDays).some(Boolean)).length;
      break;
    case `archieve`:
      count = tasksArray.filter((it) => it.isArchieve === true).length;
      break;
  }
  return count;
};

export {generateFilters};
