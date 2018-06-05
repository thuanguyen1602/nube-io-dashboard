import { parse } from 'url';
import moment from 'moment';

export function gasData(params) {
  const gas = {
    xValues: [],
    yValues: {
      values: [],
    },
    sum: 0,
  };

  const startDate = moment(parseInt(params.start));
  const endDate = moment(parseInt(params.end));
  const numDays = Math.abs(startDate.diff(endDate, 'days')) + 1;
  let day = startDate.startOf('day');

  for (let i = 0; i < numDays; i++) {
    gas.xValues.push(day.format('DD-MM-YYYY'));
    gas.yValues.values.push(Math.floor(Math.random() * 100 + 100));
    day = moment(day.add(1, 'day'));
    gas.sum += gas.yValues.values[i];
  }

  return {
    ...gas,
  };
}

export function getGas(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = gasData(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getGas,
};
