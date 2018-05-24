import { queryAlerts } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    alerts: [],
  },

  effects: {
    *fetchAlerts(_, { call, put }) {
      const data = yield call(queryAlerts);
      yield put({
        type: 'saveAlerts',
        payload: data,
      });
      yield put({
        type: 'user/changeAlertCount',
        payload: data.length,
      });
    },
    *clearAlerts({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedAlerts',
        payload,
      });
      const count = yield select(state => state.global.alerts.length);
      yield put({
        type: 'user/changeAlertCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveAlerts(state, { payload }) {
      return {
        ...state,
        alerts: payload,
      };
    },
    saveClearedAlerts(state, { payload }) {
      return {
        ...state,
        alerts: state.alerts,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
