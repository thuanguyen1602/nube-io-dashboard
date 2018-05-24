import { electricalData } from '../services/api';

export default {
  namespace: 'electrical',

  state: {
    club: {},
    carpark: {},
    seniorsCommon: {},
    seniorsLiving: {},
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(electricalData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        club: {},
        carpark: {},
        seniorsCommon: {},
        seniorsLiving: {},
        sumSeniorsLiving: 0,
      };
    },
  },
};
