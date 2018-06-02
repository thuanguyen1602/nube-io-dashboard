import { httpGet } from '../services/api';

export default {
  namespace: 'http',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          id: payload.id,
          loading: true,
        },
      });
      const response = yield call(httpGet, payload);
      yield put({
        type: 'updateState',
        payload: {
          id: payload.id,
          loading: false,
          response,
        },
      });
    },
    // *post({ payload }, { call }) {
    //   yield call(postGrid, payload);
    //   message.success('Saved!');
    // },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        [payload.id]: {
          loading: payload.loading,
          ...payload.response,
        },
      };
    },
    clearState() {
      return {};
    },
  },
};
