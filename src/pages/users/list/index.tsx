import React, { Component, Fragment } from 'react';
import { Card, Col, Form, Button, Input, Row, Table, Avatar, Divider, message } from 'antd';
import { router } from 'umi';
import { parse, stringify } from 'qs';
import { get } from 'lodash';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState, ConnectProps, UserListModelState, Loading } from '@/models/connect';
import { IPermission, IRole, IUser } from '@/models/data';
import { getAntdPaginationProps } from '@/utils/XUtils';
import RoleForm from './components/RoleForm';
import PermissionForm from './components/PermissionForm';
import * as services from './services';
import styles from './style.less';

const FormItem = Form.Item;

const defaultQueryParams = {};

interface UserListProps extends ConnectProps, FormComponentProps {
  loading: Loading;
  userList: UserListModelState;
}

interface UserListState {
  permissionModalVisible: boolean;
  roleModalVisible: boolean;
  currentUser: IUser;
  allRoles: IRole[];
  currentRoles: IRole[];
  allPermissions: IPermission[];
  currentPermissions: IPermission[];
}

@connect(({ userList, loading }: ConnectState) => ({
  userList,
  loading,
}))
class UserList extends Component<UserListProps, UserListState> {
  state: UserListState = {
    permissionModalVisible: false,
    roleModalVisible: false,
    currentUser: {},
    allRoles: [],
    currentRoles: [],
    allPermissions: [],
    currentPermissions: [],
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      render (avatar: string) {
        return <Avatar src={avatar} icon="user" />;
      },
    },
    {
      title: '用户编号',
      dataIndex: 'id',
    },
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '邮箱号码',
      dataIndex: 'email',
    },
    {
      title: '所在地区',
      dataIndex: 'extends',
      render (ext: any) {
        return (
          <span>
            {`${get(ext, 'province')} `}
            {get(ext, 'city')}
          </span>
        );
      },
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      render: (_: any, user: IUser) => (
        <Fragment>
          <a onClick={() => this.handleRoleModalVisible(true, user)}>分配角色</a>
          <Divider type="vertical" />
          <a onClick={() => this.handlePermissionModalVisible(true, user)}>分配权限</a>
        </Fragment>
      ),
    },
  ];

  UNSAFE_componentWillMount () {
    this.queryList(this.props.location.search);
  }

  UNSAFE_componentWillReceiveProps (nextProps: Readonly<UserListProps>): void {
    if (nextProps.location.search !== this.props.location.search) {
      this.queryList(nextProps.location.search);
    }
  }

  queryList = (params: object | string) => {
    const query = params instanceof Object ? params : parse(params.replace(/^\?/, ''));

    const queryParams = {
      ...defaultQueryParams,
      ...query,
    };

    this.props.dispatch({
      type: 'userList/fetch',
      payload: queryParams,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { location: { pathname }, form: { getFieldsValue } } = this.props;

    router.push({
      pathname,
      search: stringify({
        ...getFieldsValue(),
      }),
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.queryList({});
  };

  handlePermissionModalVisible = async (flag?: boolean, user?: IUser) => {
    if (!!flag && user) {
      const hide = message.loading('正在加载权限数据...', 0);

      try {
        const { allPermissions } = this.state;
        if (allPermissions.length === 0) {
          const { data: allPermissions } = await services.getAllPermissions();
          this.setState({ allPermissions });
        }

        const { data: currentPermissions } = await services.getUserPermissions(user.id as number);
        this.setState({ currentPermissions });
      } finally {
        hide();
      }
    }

    this.setState({
      permissionModalVisible: !!flag,
      currentUser: user || {},
    });
  };

  handleRoleModalVisible = async (flag?: boolean, user?: IUser) => {
    if (!!flag && user) {
      const hide = message.loading('正在加载角色数据...', 0);

      try {
        const { allRoles } = this.state;
        if (allRoles.length === 0) {
          const { data: allRoles } = await services.getAllRoles();
          this.setState({ allRoles });
        }

        const { data: currentRoles } = await services.getUserRoles(user.id as number);
        this.setState({ currentRoles });
      } finally {
        hide();
      }
    }

    this.setState({
      roleModalVisible: !!flag,
      currentUser: user || {},
    });
  };


  handleAssignPermissions = async (user_id: number, values: { permissions: number }) => {
    await this.props.dispatch({
      type: 'userList/assignPermissions',
      user_id,
      payload: {
        ...values,
      },
    });
    message.success('权限分配成功！');
    this.handlePermissionModalVisible();
  };

  handleAssignRoles = async (user_id: number, values: { roles: number }) => {
    await this.props.dispatch({
      type: 'userList/assignRoles',
      user_id,
      payload: {
        ...values,
      },
    });
    message.success('角色分配成功！');
    this.handleRoleModalVisible();
  };

  renderSearchForm () {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 12, lg: 24 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <div className={styles.action}>
              <div className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render () {
    const {
      userList: { list, meta },
      loading,
      location: { pathname, search },
    } = this.props;
    const {
      roleModalVisible,
      permissionModalVisible,
      currentUser,
      allRoles,
      currentRoles,
      allPermissions,
      currentPermissions,
    } = this.state;

    const query = parse(search.replace(/^\?/, ''));

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.searchForm}>{this.renderSearchForm()}</div>
            <Table
              dataSource={list}
              pagination={getAntdPaginationProps(meta, pathname, query)}
              columns={this.columns}
              loading={loading.effects['userList/fetch']}
              rowKey="id"
            />
          </div>
          <RoleForm
            handleAssignRoles={this.handleAssignRoles}
            handleModalVisible={this.handleRoleModalVisible}
            modalVisible={roleModalVisible}
            loading={loading.effects['userList/assignRoles']}
            currentUser={currentUser}
            allRoles={allRoles}
            currentRoles={currentRoles}
          />
          <PermissionForm
            handleAssignPermissions={this.handleAssignPermissions}
            handleModalVisible={this.handlePermissionModalVisible}
            modalVisible={permissionModalVisible}
            loading={loading.effects['userList/assignPermissions']}
            currentUser={currentUser}
            allPermissions={allPermissions}
            currentPermissions={currentPermissions}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<UserListProps>()(UserList);
