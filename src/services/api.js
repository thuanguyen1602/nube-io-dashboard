import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryAlerts() {
  return request('/api/alerts');
}






export async function usageData() {
  return request('/api/usage_data');
}




export async function homeData(params) {
  return request(`/api/home_data?${stringify(params)}`);
}

export async function electricalData(params) {
  return request(`/api/electrical_data?${stringify(params)}`);
}

export async function queryApartmentData(params) {
  return request(`/api/apartment_data?${stringify(params)}`);
}

export async function queryGrid(params) {
  return request('http://localhost:3000/grid');
}

export function postGrid(params) {
  return request('http://localhost:3000/grid', {
    method: 'POST',
    body: params,
  });
}

export async function httpGet(req) {
  console.log(req);
  return request(`${req.host}?${stringify(req.params)}`);
}
