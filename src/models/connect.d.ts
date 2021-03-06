import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { StateType as AuthStateType } from './auth';
import { StateType as ArticleListModelState } from '@/pages/articles/list/model';
import { StateType as ArticleCreateModelState } from '@/pages/articles/create/model';
import { StateType as ArticleEditModelState } from '@/pages/articles/edit/model';
import { StateType as ArticleShowModelState } from '@/pages/articles/show/model';
import { StateType as UserListModelState } from '@/pages/users/list/model';
import { StateType as AccountCenterModelState } from '@/pages/account/center/model';
import { StateType as AccountNotificationsModelState } from '@/pages/account/notifications/model';
import { StateType as AccountSettingsModelState } from '@/pages/account/settings/model';
import { StateType as RoleListModelState } from '@/pages/roles/list/model';
import { StateType as PermissionListModelState } from '@/pages/permissions/list/model';
import { StateType as TagListModelState } from '@/pages/tags/list/model';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';

export {
  GlobalModelState,
  SettingModelState,
  AuthStateType,
  ArticleListModelState,
  ArticleCreateModelState,
  ArticleEditModelState,
  ArticleShowModelState,
  UserListModelState,
  AccountCenterModelState,
  AccountNotificationsModelState,
  AccountSettingsModelState,
  RoleListModelState,
  PermissionListModelState,
  TagListModelState,
};

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    auth?: boolean;
    articleList?: boolean;
    articleCreate?: boolean;
    articleEdit?: boolean;
    articleShow?: boolean;
    userList?: boolean;
    accountCenter?: boolean;
    accountNotifications?: boolean;
    accountSettings?: boolean;
    roleList?: boolean;
    permissionList?: boolean;
    notificationList?: boolean;
    tagList?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  auth: AuthStateType;
  articleList: ArticleListModelState;
  articleCreate: ArticleCreateModelState;
  articleEdit: ArticleEditModelState;
  articleShow: ArticleShowModelState;
  userList: UserListModelState;
  accountCenter: AccountCenterModelState;
  accountNotifications: AccountNotificationsModelState;
  accountSettings: AccountSettingsModelState;
  roleList: RoleListModelState;
  permissionList: PermissionListModelState;
  tagList?: TagListModelState;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends RouterTypes<Route, T> {
  dispatch: Dispatch;
  location: RouterTypes<Route, T>['location'] & {
    query: { [key: string]: string };
  };
}
