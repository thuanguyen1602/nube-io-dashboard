import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getAlertData() {
    const { alerts = [] } = this.props;
    if (alerts.length === 0) {
      return [];
    }
    const newAlerts = alerts.map(alert => {
      const newAlert = { ...alert };
      if (newAlert.datetime) {
        newAlert.datetime = moment(alert.datetime).fromNow();
      }
      // transform id to item key
      if (newAlert.id) {
        newAlert.key = newAlert.id;
      }
      if (newAlert.priority) {
        const color = {
          low: 'yellow',
          medium: 'orange',
          high: 'red',
        }[newAlert.status];
        newAlert.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newAlert.extra}
          </Tag>
        );
      }
      return newAlert;
    });
    return newAlerts;
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingAlerts,
      isMobile,
      logo,
      onAlertVisibleChange,
      onMenuClick,
      onAlertClear,
      rangePicker
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />Logout
        </Menu.Item>
      </Menu>
    );

    const alertData = this.getAlertData();

    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {rangePicker}
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onAlertClear}
            onPopupVisibleChange={onAlertVisibleChange}
            loading={fetchingAlerts}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={alertData}
              title="New Alerts"
              emptyText="No new alerts"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
