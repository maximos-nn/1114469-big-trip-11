export const createTripInfoTemplate = (title, period) => {
  return (
    `          <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${period}</p>
    </div>

  </section>
`
  );
};
