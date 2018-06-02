import { parse } from 'url';
import moment from 'moment';

export function thermalData(params) {
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
    thermal.xValues.push(day.format('DD-MM-YYYY'));
    thermal.yValues.push(Math.floor(Math.random() * 100 + 100));
    day = moment(day.add(1, 'day'));
    thermal.sum += thermal.yValues[i];
  }

  return {
    ...thermal,
  };
}

export function getThermal(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = thermalData(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getThermal,
};
