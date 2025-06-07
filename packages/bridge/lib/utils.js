const utils = {

  isIOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false
  }
  
}

export default utils;

