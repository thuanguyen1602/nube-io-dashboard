import { parse } from 'url';
import moment from 'moment';

export function electricalData(params) {
  const electrical = {
    xValues: [],
    yValues: {
      peak: [],
      offPeak: [],
      shoulder: [],
    },
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

  return {
    ...electrical,
  };
}

export function getElectrical(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = electricalData(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getElectrical,
};

// import { parse } from 'url';
// import moment from 'moment';
//
// export function ElectricalData(params) {
//
//   const club = {
//     xValues: [],
//     yValues: {
//       peak: [],
//       offPeak: [],
//       shoulder: []
//     },
//     sum: 0
//   };
//
//   const carpark = {
//     xValues: [],
//     yValues: {
//       peak: [],
//       offPeak: [],
//       shoulder: []
//     },
//     sum: 0
//   };
//
//   const seniorsCommon = {
//     xValues: [],
//     yValues: {
//       peak: [],
//       offPeak: [],
//       shoulder: []
//     },
//     sum: 0
//   };
//
//   const seniorsLiving = {
//     xValues: [],
//     yValues: {
//       peak: [],
//       offPeak: [],
//       shoulder: []
//     },
//     sum: 0
//   };
//
//   const data = {
//     club,
//     carpark,
//     seniorsCommon,
//     seniorsLiving,
//   };
//
//   const startDate = moment(parseInt(params.start));
//   const endDate = moment(parseInt(params.end));
//   const numDays = Math.abs(startDate.diff(endDate, 'days')) + 1;
//   var day = startDate.startOf('day');
//
//   for (let prop in data) {
//     let scale = 0;
//     switch(prop) {
//       case 'club':
//         scale = 10;
//         break;
//       case 'carpark':
//         scale = 2;
//         break;
//       case 'seniorsCommon':
//         scale = 3;
//         break;
//       case 'seniorsLiving':
//         scale = 8;
//         break;
//     }
//     for(let i = 0; i < numDays; i++) {
//       data[prop].xValues.push(day.format("DD-MM-YYYY"));
//       data[prop].yValues.peak.push(Math.floor((Math.random() * 100 * scale) + 100))
//       data[prop].yValues.offPeak.push(Math.floor((Math.random() * 30 * scale) + 50))
//       data[prop].yValues.shoulder.push(Math.floor((Math.random() * 30 * scale) + 50))
//       day = moment(day.add(1, 'day'));
//       data[prop].sum +=
//         data[prop].yValues.peak[i] +
//         data[prop].yValues.offPeak[i] +
//         data[prop].yValues.shoulder[i];
//     }
//   }
//
//   return data
// };
//
// export function getElectricalData(req, res, u) {
//   let url = u;
//   if (!url || Object.prototype.toString.call(url) !== '[object String]') {
//     url = req.url; // eslint-disable-line
//   }
//
//   const params = parse(url, true).query;
//   const result = ElectricalData(params);
//
//   if (res && res.json) {
//     res.json(result);
//   } else {
//     return result;
//   }
// }
//
// export default {
//   getElectricalData
// };
