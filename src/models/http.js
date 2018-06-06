import { httpGet, httpPost } from '../services/api';

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
    *post({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          id: payload.id,
          loading: true,
        },
      });
      const response = yield call(httpPost, payload);
      yield put({
        type: 'updateState',
        payload: {
          id: payload.id,
          loading: false,
          response,
        },
      });
    },
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
