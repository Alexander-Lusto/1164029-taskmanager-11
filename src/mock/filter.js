const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archieve`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.round(Math.random() * 10),
    };
  });
};

export {generateFilters};
