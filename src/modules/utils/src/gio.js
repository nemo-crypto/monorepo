// 自定义埋点
export const trackEvent = (event, params = {}) => {
  try {
    window.gio && window.gio('track', event, params);
  } catch (e) { }
};

// 设置登录用户ID
export const setUserIdGio = (userId) => {
  const randomNum = Math.floor(Math.random() * 90 + 10);
  const newUserId = `${randomNum}${userId}`;
  try {
    window.gio && window.gio('setUserId', newUserId); 
  } catch (e) { }
};

// gio清除登录用户ID
export const clearUserIdGio = () => {
  try {
    window.gio && window.gio('clearUserId');
  } catch (e) { }
};



