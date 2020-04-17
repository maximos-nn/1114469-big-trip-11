export const getDate = (unixTime) => {
  const date = new Date(unixTime);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
