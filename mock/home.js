import { parse } from 'url';
import moment from 'moment';

export function homeData(params) {
  const electrical = {
    xValues: [],
    yValues: {
      peak: [],
      offPeak: [],
      shoulder: [],
    },
    sum: 0,
  };

  const water = {
    xValues: [],
    yValues: [],
    sum: 0,
  };

  const gas = {
    xValues: [],
    yValues: [],
    sum: 0,
  };
  const thermal = {
    xValues: [],
    yValues: [],
    sum: 0,
  };

  const startDate = moment(parseInt(params.start));
  const endDate = moment(parseInt(params.end));
  const numDays = Math.abs(startDate.diff(endDate, 'days')) + 1;
  let day = startDate.startOf('day');

  for (let i = 0; i < numDays; i++) {
    electrical.xValues.push(day.format('DD-MM-YYYY'));
    electrical.yValues.peak.push(Math.floor(Math.random() * 1500 + 100));
    electrical.yValues.offPeak.push(Math.floor(Math.random() * 500 + 50));
    electrical.yValues.shoulder.push(Math.floor(Math.random() * 500 + 50));
    day = moment(day.add(1, 'day'));
    electrical.sum +=
      electrical.yValues.peak[i] + electrical.yValues.offPeak[i] + electrical.yValues.shoulder[i];
  }

  day = startDate.startOf('day');

  for (let i = 0; i < numDays; i++) {
    water.xValues.push(day.format('DD-MM-YYYY'));
    water.yValues.push(Math.floor(Math.random() * 100 + 100));
    day = moment(day.add(1, 'day'));
    water.sum += water.yValues[i];
  }

  day = startDate.startOf('day');

  for (let i = 0; i < numDays; i++) {
    gas.xValues.push(day.format('DD-MM-YYYY'));
    gas.yValues.push(Math.floor(Math.random() * 100 + 100));
    day = moment(day.add(1, 'day'));
    gas.sum += gas.yValues[i];
  }

  day = startDate.startOf('day');

  for (let i = 0; i < numDays; i++) {
    thermal.xValues.push(day.format('DD-MM-YYYY'));
    thermal.yValues.push(Math.floor(Math.random() * 100 + 100));
    day = moment(day.add(1, 'day'));
    thermal.sum += thermal.yValues[i];
  }

  return {
    electrical,
    water,
    gas,
    thermal,
  };
}

export function getHomeData(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = homeData(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getHomeData,
};
