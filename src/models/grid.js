import { queryGrid, postGrid } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'grid',

  state: {
    layouts: {},
    items: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryGrid);
      yield put({
        type: 'updateState',
        payload: response,
      });
    },
    *post({ payload }, { call }) {
      yield call(postGrid, payload);
      message.success('Saved!');
    },
  },
  
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearState() {
      return {
        layouts: {},
        items: {}
      };
    },
  },
};
