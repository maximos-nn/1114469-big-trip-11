import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BAR_HEIGHT = 55;
const MIN_CHART_HIGHT = 150;
const MS_PER_HOUR = 3600000;
const TRANSPORT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

const renderChart = (ctx, totals, title, prefix, suffix) => {
  ctx.height = Math.max(BAR_HEIGHT * totals.size, MIN_CHART_HIGHT);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Array.from(totals.keys()).map((label) => label.toUpperCase()),
      datasets: [{
        data: Array.from(totals.values()),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${prefix}${val}${suffix}`
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const mapPriceToType = (result, event) => {
  const key = event.type;
  if (!result.has(key)) {
    result.set(key, 0);
  }
  result.set(key, result.get(key) + event.price);
  return result;
};

const getSumByEventType = (events) => events.reduce(mapPriceToType, new Map());

const renderMoneyChart = (moneyCtx, events) => {
  const sumByEventType = getSumByEventType(events);
  return renderChart(moneyCtx, sumByEventType, `MONEY`, `€ `, ``);
};

const mapCountToType = (result, event) => {
  const key = event.type;
  if (!result.has(key)) {
    result.set(key, 0);
  }
  result.set(key, result.get(key) + 1);
  return result;
};

const getCountByEventType = (events) => events.reduce(mapCountToType, new Map());

const renderTransportChart = (transportCtx, events) => {
  const countByType = getCountByEventType(events);
  const transportTotals = new Map();
  TRANSPORT_TYPES.forEach((type) => {
    if (countByType.has(type)) {
      transportTotals.set(type, countByType.get(type));
    }
  });
  return renderChart(transportCtx, transportTotals, `TRANSPORT`, ``, `x`);
};

const mapDurationToType = (result, event) => {
  const key = event.type;
  const duration = Math.abs(event.startDate - event.endDate);
  if (!result.has(key)) {
    result.set(key, 0);
  }
  result.set(key, result.get(key) + duration);
  return result;
};

const getTimeByEventType = (events) => events.reduce(mapDurationToType, new Map());

const renderTimeSpentChart = (timeSpentCtx, events) => {
  const timeByType = getTimeByEventType(events);
  timeByType.forEach((duration, type, map) => {
    map.set(type, Math.floor(duration / MS_PER_HOUR));
  });
  return renderChart(timeSpentCtx, timeByType, `TIME SPENT`, ``, `H`);
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(model) {
    super();
    this._model = model;
    this._events = model.allEvents;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  rerender(events) {
    this._events = events;
    super.rerender();
    this._renderCharts();
  }

  show(hiddenClass) {
    super.show(hiddenClass);
    this.rerender(this._model.allEvents);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }

  _renderCharts() {
    if (!this._events.length) {
      return;
    }
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderTransportChart(transportCtx, this._events);
    this._timeSpentChart = renderTimeSpentChart(timeSpentCtx, this._events);
  }
}
