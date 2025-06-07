'use strict';
import utils from './utils.js';
import info from './error.js';
const MAX_WAIT_FOR_READY = 15000;

const fetchBridge = () => {
	if (window.WebViewJavascriptBridge) {
		return window.WebViewJavascriptBridge;
	}
	return null;
};

const creatiOSeDelayPromise = timeout => {
	return new Promise((_resolve, reject) => {
		setTimeout(() => {
			if (!window.WebViewJavascriptBridge) {
				reject(info['BRIDGE_TIMEOUT']);
			}
		}, timeout);
	});
};

/**
 * @param {*} callback 
 * @returns 
 */
export const bridgeReady = (schema) => {
	const handlePromise = new Promise((resolve, _reject) => {
		if (window.WebViewJavascriptBridge) {
			resolve(window.WebViewJavascriptBridge);
		} else {
			if (utils.isIOS()) {
				if (window.WVJBCallbacks) {
					return window.WVJBCallbacks.push(resolve);
				}
				window.WVJBCallbacks = [resolve];
				var WVJBIframe = document.createElement('iframe');
				WVJBIframe.style.display = 'none';
				WVJBIframe.src = `${schema || 'ida'}://__bridge_loaded__`;
				document.documentElement.appendChild(WVJBIframe);
				setTimeout(function () {
					document.documentElement.removeChild(WVJBIframe);
				}, 0);
			} else {
				document.addEventListener('WebViewJavascriptBridgeReady', () => {
					resolve(window.WebViewJavascriptBridge);
				}, false);
			}
		}
	});
	return Promise.race([creatiOSeDelayPromise(MAX_WAIT_FOR_READY), handlePromise]);
};

export const callApi = (action, opt) => {
	return new Promise((resolve, reject) => {
		const bridge = fetchBridge();
		if (!bridge) {
			reject(info['BRIDGE_NOTFOUND']);
		}

		opt = opt || {};
		const arrData = action && action.split('.');
		if (arrData.length < 2) {
			reject(info['PARAMETER_ERROR']);
		}
		const [apiType, userAction] = arrData;
		opt.action = userAction;
		bridge.callHandler(apiType, opt, data => {
			let parsed = {};
			if (data) {
				try {
					parsed = JSON.parse(data);
				} catch (error) { }
			}

			// Adapted to the old verison of Billance app. 
			let { hasBridge } = parsed;
			if (typeof hasBridge === 'undefined') {
				resolve(parsed);
			} else {
				if (parsed.hasBridge == false) {
					reject(info['BRIDGE_FUNCTION_NOTFOUND']);
				} else {
					resolve(parsed);
				}
			}
		});
	});
};

export const registerApi = (action, callback) => {
	const bridge = fetchBridge();
	if (!bridge) {
		reject(info['BRIDGE_NOTFOUND']);
	}
	if (!action) {
		reject(info['PARAMETER_ERROR']);
	}
	bridge.registerHandler(action, data => {
		try {
			data = JSON.parse(data);
		} catch (error) {
			reject(info['JSON_PARSE_ERROR']);
		}
		callback(null, data);
	});
};