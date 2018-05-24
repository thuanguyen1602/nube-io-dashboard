import { usageData } from '../services/api';

export default {
  namespace: 'usage',

  state: {
    electricalDataTotals: [],
    electricalData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(usageData);
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
        electricalDataTotals: [],
        electricalData: [],
      };
    },
  },
};
