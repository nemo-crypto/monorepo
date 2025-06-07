// 本地存储
export const localStore = {
  setItem: function (id, data) {
    try {
      localStorage.setItem(id, JSON.stringify(data))
    } catch (err) {}
  },
  getItem: function (id) {
    try {
      return JSON.parse(localStorage.getItem(id))
    } catch (error) {
      return null
    }
  },
  removeItem: id => {
    try {
      localStorage.removeItem(id)
    } catch (err) {}
  }
}

// 会话存储
export const sessionStore = {
  setItem: function (id, data) {
    try {
      sessionStorage.setItem(id, JSON.stringify(data))
    } catch (err) { }
  },
  getItem: function (id) {
    try {
      return JSON.parse(sessionStorage.getItem(id))
    } catch (error) {
      return null
    }
  },
  removeItem: id => {
    try {
      sessionStorage.removeItem(id)
    } catch (err) { }
  }
}

export default localStore
