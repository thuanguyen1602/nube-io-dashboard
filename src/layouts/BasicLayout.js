import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, DatePicker } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, getTimeDistance } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import bigLogo from '../assets/logo.png';
import smallLogo from '../assets/logo-small.png';
import styles from './BasicLayout.less';

const logo = { big: bigLogo, small: smallLogo };

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;
const { RangePicker } = DatePicker;

/**
 * Get redirected address based on menu.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * Get breadcrumb mapping
 * @param {Object} menuData Menu configuration
 * @param {Object} routerData Routing configuration
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
let isTablet;
const mobileQuery = 'only screen and (max-width: 768px)';
const tabletQuery = 'only screen and (max-width: 992px)'; 
enquireScreen(mobile => {
  isMobile = mobile;
}, mobileQuery);

enquireScreen(tablet => {
  isTablet = tablet;
}, mobileQuery);

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
    isTablet
  };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData)
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'global/changeRangePickerValue',
      payload: getTimeDistance('month')
    });
  }

  componentDidMount() {
    this.mobileEnquireHandler = enquireScreen(mobile => {
      console.log('isMobile:', mobile);
      this.setState({
        isMobile: mobile
      });
    }, mobileQuery);

    this.tabletEnquireHandler = enquireScreen(tablet => {
      console.log('isTablet:', tablet);
      this.setState({
        isTablet: tablet
      });
    }, tabletQuery);

    this.props.dispatch({
      type: 'user/fetchCurrent'
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.mobileEnquireHandler);
    unenquireScreen(this.tabletEnquireHandler);
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Nube iO';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - Nube iO`;
    }
    return title;
  }

  getBashRedirect = () => {
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  };

  handleAlertClear = type => {
    message.success('Cleared Alerts');
    this.props.dispatch({
      type: 'global/clearAlerts',
      payload: type
    });
  };

  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout'
      });
    }
  };

  handleAlertVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchAlerts'
      });
    }
  };

  handleRangePickerChange = rangePickerValue => {
    if (Array.isArray(rangePickerValue) && rangePickerValue.length > 0) {
      this.props.dispatch({
        type: 'global/changeRangePickerValue',
        payload: rangePickerValue
      });
    }
  };

  selectDate = type => {
    this.props.dispatch({
      type: 'global/changeRangePickerValue',
      payload: getTimeDistance(type)
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.props;
    const value = getTimeDistance(type);
    if (!rangePickerValue || !rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const {
      currentUser,
      collapsed,
      fetchingAlerts,
      alerts,
      routerData,
      match,
      location,
      rangePickerValue,
    } = this.props;

    const bashRedirect = this.getBashRedirect();

    const rangePicker = (
      <div className={styles.rangePickerWrap}>
        {
          !this.state.isTablet &&
          <div className={styles.rangePicker}>
            <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
              Today
            </a>
            <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
              This Week
            </a>
            <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
              This Month
            </a>
            <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
              This Year
            </a>
          </div>
        }
        <RangePicker
          value={rangePickerValue}
          format="DD-MM-YYYY"
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo.small}
              currentUser={currentUser}
              fetchingAlerts={fetchingAlerts}
              alerts={alerts}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onAlertClear={this.handleAlertClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onAlertVisibleChange={this.handleAlertVisibleChange}
              rangePicker={rangePicker}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> Nube iO 2018
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingAlerts: loading.effects['global/fetchAlerts'],
  alerts: global.alerts,
  rangePickerValue: global.rangePickerValue
}))(BasicLayout);
