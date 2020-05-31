const getDate = (unixTime) => {
  const date = new Date(unixTime);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getEventTypeData = (eventTypes, currentType) => {
  for (const group of eventTypes) {
    const {types, preposition, offers} = group;
    const index = types.findIndex((type) => type === currentType);
    if (index === -1) {
      continue;
    }
    return {type: currentType, preposition, offers: offers[currentType]};
  }
  return {};
};

export {getDate, getEventTypeData};
