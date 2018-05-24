import moment from 'moment';

const beginDay = moment().startOf('day').subtract(1, 'years')

const electricalData = [];
var day = beginDay;

for (let i = 0; i < 31; i += 1) {
  var y1 = Math.floor(Math.random() * 1000) + 200
  var y2 = Math.floor(Math.random() * 500) + 200
  var y3 = Math.floor(Math.random() * 400) + 200
  var total = y1 + y2 + y3;

  electricalData.push({
    x: day.format("DD/MM/YYYY"),
    y: total,
    y1: y1,
    y2: y2,
    y3: y3,
  });
  day = moment(day.add(1, 'day'));
}

// const data = [
//   { name:'London', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.' :39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
//   { name:'Berlin', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.' :34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4}
// ];

const electricalDataTotals = [
  {
    x: 'Peak',
    y: 4544,
  },
  {
    x: 'Off-Peak',
    y: 3321,
  },
  {
    x: 'Shoulder',
    y: 3113,
  },
];

export const getUsageData = {
  electricalDataTotals,
  electricalData,
};

export default {
  getUsageData,
};
