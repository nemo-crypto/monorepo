import mockjs from 'mockjs';
import moment from 'moment';

const { Random } = mockjs
// 参考文档：http://mockjs.com/examples.html

// 生成随机数据
export const random = {
  enum: (arr) => arr[Math.floor(Math.random() * arr.length)],
  timestamp: () => moment(Random.datetime()).format('x'),
  ...Random
}

// 模拟网络请求时间
// referene https://github.com/nikogu/roadhog-api-doc/blob/master/lib/utils.js
export const delay = function (proxy, timer = 1500 * 1) {
  let mockApi = {};
  Object.keys(proxy).forEach(function (key) {
    let result = proxy[key].$body || proxy[key];
    if (Object.prototype.toString.call(result) === '[object String]' && /^http/.test(result)) {
      mockApi[key] = proxy[key];
    } else {
      mockApi[key] = function (req, res) {
        let foo;
        if (Object.prototype.toString.call(result) === '[object Function]') {
          foo = result;
        } else {
          foo = function (req, res) {
            res.json(result);
          };
        }
        setTimeout(function () {
          foo(req, res);
        }, timer);
      };
    }
  });
  mockApi.__mockData = proxy;
  return mockApi;
};



