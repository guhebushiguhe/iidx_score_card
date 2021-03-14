import axios from 'axios'

// 请求超时时间
// axios.defaults.timeout = 1000 * 10;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ0b2tlbiIsImlhdCI6MTYxMTU5NTY3MSwic3ViIjoiNjQyMDQ2MjYxQHFxLmNvbSIsInNjb3BlIjoibWFjaGluZV9hY2Nlc3Mgcml2YWxfd3JpdGUgc2V0dGluZ3NfcmVhZCBzZXR0aW5nc193cml0ZSJ9.stRjxVQB_-0nkJnJf4o2ZNGyQGUmOI4RddUKC5BEKZ4'
// 设置公共url
axios.defaults.baseURL = 'https://arcana.nu'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  return config;
}, function (err) {
  console.log(err);
  return Promise.reject(err);
});

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  return res.data;
}, function (err) {
  console.log(err);
  return Promise.reject(err);
});

export default axios