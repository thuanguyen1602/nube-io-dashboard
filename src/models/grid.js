import { message } from 'antd';
import { queryGrid, postGrid } from '../services/api';

export default {
  namespace: 'grid',

  state: {
    layouts: {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: [],
    },
    items: [],
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
        layouts: {
          lg: [],
          md: [],
          sm: [],
          xs: [],
          xxs: [],
        },
        items: [],
      };
    },
  },
};
