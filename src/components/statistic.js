import AbstractComponent from './abstract-component.js';
import {Color} from '../const.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createStatisticTemplate = () => {
  const today = moment();
  const week = 7 * 24 * 60 * 60 * 1000;
  const weekAgo = moment(today - week);

  return `<section class="statistic container">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

        <div class="statistic-input-wrap">
          <input
            class="statistic__period-input"
            type="text"
            placeholder="${weekAgo.format(`MM.DD`)} - ${today.format(`MM.DD`)}"
          />
        </div>

        <p class="statistic__period-result">
          In total for the specified period
          <span class="statistic__task-found">0</span> tasks were fulfilled.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas id="statistic__days" class="statistic__days" width="550" height="150"></canvas>
      </div>
    </div>

    <div class="statistic__circle">
      <div class="statistic__colors-wrap">
        <canvas id="statistic__colors" class="statistic__colors" width="400" height="300"></canvas>
      </div>
    </div>
  </section>`;
};


export default class Statistic extends AbstractComponent {
  constructor() {
    super();

    this._flatpickr = null;
    this._applyFlatpickr();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElement = this.getElement().querySelector(`.statistic__period-input`);
    this._flatpickr = flatpickr(dateElement, {
      altInput: true,
      allowInput: true,
    });
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  onDateChange(callback) {
    this._getElement().querySelector(``).addEventListener(`change`, callback);
  }

  createLineChart() {
    const randomScalingFactor = () => {
      return Math.round(Math.random() * 100);
    };
    Chart.defaults.global.elements.point.backgroundColor = `rgb(1,1,1)`;
    let config = {
      type: `line`,
      data: {
        labels: [`January`, `February`, `March`, `April`, `May`, `June`, `July`],
        datasets: [{
          label: false,
          backgroundColor: `white`,
          borderColor: `black`,
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          fill: true,
        }]
      },
      options: {
        responsive: false,
        title: {
          display: false,
          text: `Chart.js Line Chart`
        },
        tooltips: {
          mode: `index`,
          intersect: false,
        },
        hover: {
          mode: `nearest`,
          intersect: false,
        },
        scales: {
          xAxes: [{
            display: false,
            scaleLabel: {
              display: false,
              labelString: `Month`
            }
          }],
          yAxes: [{
            display: false,
            scaleLabel: {
              display: false,
              labelString: `Value`
            }
          }]
        }
      }
    };
    Chart.defaults.global.layout.padding = 20;

    Chart.defaults.global.elements.point.radius = 10;
    Chart.defaults.global.elements.point.borderWidth = 0; //pointHoverBackgroundColor
    Chart.defaults.global.elements.point.pointHoverBackgroundColor = `black`;
    Chart.defaults.global.elements.point.hoverRadius = 10;
    Chart.defaults.global.legend.display = false;

    let ctx = document.getElementById(`statistic__days`).getContext(`2d`);
    window.myLine = new Chart(ctx, config);


  }

  createCircleDiagram(tasks) {
    const randomScalingFactor = () => {
      return Math.round(Math.random() * 100);
    };

    const calculateArea = (color) => {
      return tasks.filter((task) => task.color === color).length;
    };

    const config = {
      type: `pie`,
      data: {
        datasets: [{
          data: [
            calculateArea(Color.BLACK),
            calculateArea(Color.YELLOW),
            calculateArea(Color.PINK),
            calculateArea(Color.GREEN),
            calculateArea(Color.BLUE),
          ],
          backgroundColor: [
            Color.BLACK,
            Color.YELLOW,
            Color.PINK,
            Color.GREEN,
            Color.BLUE,
          ],
          label: `Dataset 1`
        }],
        labels: [
          Color.BLACK,
          Color.YELLOW,
          Color.PINK,
          Color.GREEN,
          Color.BLUE
        ]
      },
      options: {
        responsive: true
      }
    };

    let ctx = document.getElementById(`statistic__colors`).getContext(`2d`);
    window.myPie = new Chart(ctx, config);
  }

}
