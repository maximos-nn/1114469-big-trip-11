const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const filterEvents = (events, filterType) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return events.filter((event) => event.startDate > new Date());
    case FilterType.PAST:
      return events.filter((event) => event.startDate < new Date());
    default:
      return events;
  }
};

export {FilterType, filterEvents};
