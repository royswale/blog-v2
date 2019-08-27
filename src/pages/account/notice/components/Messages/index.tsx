import React from 'react';
import { List } from 'antd';
import { parse } from 'qs';
import { AccountNoticeModelState, ConnectProps, Loading } from '@/models/connect';

const defaultQueryParams = {};

interface MessagesProps extends ConnectProps {
  loading: Loading;
  accountNotice: AccountNoticeModelState;

  [key: string]: any;
}

class Messages extends React.Component<MessagesProps> {
  componentWillMount() {
    this.queryMessages(this.props.location.search);
  }

  queryMessages = (params: object | string) => {
    const query = params instanceof Object ? params : parse(params.replace(/^\?/, ''));

    const queryParams = {
      ...defaultQueryParams,
      ...query,
    };

    this.props.dispatch({
      type: 'accountNotice/fetchMessages',
      payload: queryParams,
    });
  };

  handlePageChange = (page: number, pageSize?: number) => {
    const { location: { search } } = this.props;
    const query = parse(search.replace(/^\?/, ''));
    this.queryMessages({ ...query, page, pageSize });
  };

  render() {
    const {
      loading,
      accountNotice: { messages: { list, pagination } },
    } = this.props;

    // todo

    return (
      <List
        size="large"
        rowKey="id"
        itemLayout="vertical"
        loading={loading.effects['accountNotice/fetchMessages']}
        dataSource={list}
        pagination={{
          ...pagination,
          onChange: this.handlePageChange,
        }}
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
          >
            messages
          </List.Item>
        )}
      />
    );
  }
}

export default Messages;