import { httpGet, httpPost } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'http',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(httpGet, payload);
      console.log('response', response);
      yield put({
        type: 'updateState',
        payload: response,
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
        ...payload,
      };
    },
    clear() {
      return {};
    },
  },
};
