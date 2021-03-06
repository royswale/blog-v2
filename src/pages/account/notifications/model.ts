import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { INotification, IMeta } from '@/models/data';
import * as services from './services';

export interface StateType {
  notifications: {
    list: INotification[];
    meta: IMeta;
  },
  messages: {
    list: [];
    meta: IMeta;
  },
  systems: {
    list: [];
    meta: IMeta;
  },
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchNotifications: Effect;
    fetchMessages: Effect;
    fetchSystems: Effect;
  };
  reducers: {
    queryNotifications: Reducer<StateType>;
    queryMessages: Reducer<StateType>;
    querySystems: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'accountNotifications',
  state: {
    notifications: {
      list: [],
      meta: {},
    },
    messages: {
      list: [],
      meta: {},
    },
    systems: {
      list: [],
      meta: {},
    },
  },
  effects: {
    * fetchNotifications ({ payload }, { call, put }) {
      const { data: list, meta } = yield call(services.queryNotifications, payload);

      yield put({
        type: 'queryNotifications',
        payload: {
          list,
          meta,
        },
      });
    },
    * fetchMessages () {
      yield;
      // todo
    },
    * fetchSystems () {
      yield;
      // todo
    },
  },
  reducers: {
    queryNotifications (state, action) {
      return {
        ...state,
        notifications: action.payload,
      } as StateType;
    },
    queryMessages (state, action) {
      return {
        ...state,
        messages: action.payload,
      } as StateType;
    },
    querySystems (state, action) {
      return {
        ...state,
        systems: action.payload,
      } as StateType;
    },
  },
};

export default Model;
