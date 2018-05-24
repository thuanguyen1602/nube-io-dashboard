import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Home',
    icon: 'home',
    path: 'home',
  },
  {
    name: 'Electrical',
    icon: 'dashboard',
    path: 'electrical',
  },
  {
    name: 'Water',
    icon: 'dashboard',
    path: 'water',
  },
  {
    name: 'Gas',
    icon: 'dashboard',
    path: 'gas',
  },
  {
    name: 'Thermal',
    icon: 'dashboard',
    path: 'thermal',
  }, 
  {
    name: 'Apartments',
    icon: 'team',
    path: 'apartments',
  },
  {
    name: 'Trends',
    icon: 'line-chart',
    path: 'trends',
  },
  {
    name: 'Alerts',
    icon: 'warning',
    path: 'alerts',
  },
  {
    name: 'Settings',
    icon: 'setting',
    path: 'settings',
  },
  {
    name: 'user',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: 'Login',
        path: 'login',
      },
      {
        name: 'Register',
        path: 'register',
      },
      {
        name: 'Registration Result',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
