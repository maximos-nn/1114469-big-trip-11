export const generateEventTypes = () => {
  return [
    {
      group: `Transfer`,
      preposition: `to`,
      types: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`]
    },
    {
      group: `Activity`,
      preposition: `in`,
      types: [`check-in`, `sightseeing`, `restaurant`]
    }
  ];
};
