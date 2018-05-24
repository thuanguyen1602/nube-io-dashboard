import { homeData } from '../services/api';

export default {
  namespace: 'home',

  state: {
    electrical: {},
    water: {},
    gas: {},
    thermal: {},
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(homeData, payload);
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
        electrical: {},
        water: {},
        gas: {},
        thermal: {},
        sumSeniorsLiving: 0,
      };
    },
  },
};
