import md5 from 'js-md5'
import { getAppConfig } from '@xatom/modules/config'
import { unCompileStr } from '@xatom/modules/global/compileStr'
import { v4 as uuidv4 } from 'uuid'
import { getPathname } from './url'

const crypto = require('crypto');

// 禁止明文传递密码，对密码进行简单加密
export function encodePassword(value) {
  const salt = unCompileStr(getAppConfig('compileMd5Salt'))
  return md5(value + salt)
}

// AES加密
export function encryptByAES(message) {
  if (message) {
    const ALGORITHM = 'aes-192-cbc';
    const AES_KEY_192 = unCompileStr(getAppConfig('compileAesKey'));
    const AES_VI = unCompileStr(getAppConfig('compileAesVi'));
    const key = Buffer.from(AES_KEY_192, 'hex');
    const iv = Buffer.from(AES_VI, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } else {
    return ''
  }
}

// AES加密 - ws
export function encryptWsAES(text, key, options = {}) {
  const { algorithm = 'aes-128-ecb', iv = '', encoding = 'base64', isMd5 = false } = options;
  try {
    text = isMd5 ? md5(text) : text
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', encoding);
    encrypted += cipher.final(encoding);
    return encrypted
  } catch (error) {
    throw new Error(`加密失败: ${error.message}`);
  }
}

// DES加密 - ws
export function encryptWsDES(text, key, options = {}) {
  const { algorithm = 'des-ecb', iv = '', encoding = 'base64', isMd5 = false } = options;
  try {
    text = isMd5 ? md5(text) : text
    // 创建加密器，秘钥必须是8位
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    // 加密数据
    let encrypted = cipher.update(text, 'utf8', encoding);
    encrypted += cipher.final(encoding);
    return encrypted;
  } catch (error) {
    throw new Error(`加密失败: ${error.message}`);
  }
}

// 3DES加密 - ws
export function encryptWs3DES(text, key, options = {}) {
  const { algorithm = 'des-ede3', iv = '', encoding = 'base64', isMd5 = false } = options;
  try {
    text = isMd5 ? md5(text) : text
    // 创建加密器
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    // 加密数据
    let encrypted = cipher.update(text, 'utf8', encoding);
    encrypted += cipher.final(encoding);
    return encrypted;
  } catch (error) {
    throw new Error(`加密失败: ${error.message}`);
  }
}

// base64编码
export function encryptBase64(text) {
  try {
    // 使用原生 btoa 编码
    return btoa(encodeURIComponent(text));
  } catch (error) {
    throw new Error(`Base64编码失败: ${error.message}`);
  }
}

// base64解码
export function decryptBase64(text) {
  try {
    // 使用原生 atob 解码
    return decodeURIComponent(atob(text));
  } catch (error) {
    throw new Error(`Base64解码失败: ${error.message}`);
  }
}

/**
 * 手机号脱敏
 * 展示前3位***后2位，例如：010***56
 */
export function encodePhone(v) {
  if (!v) return '--'
  return `${String(v).slice(0, 3)}***${String(v).slice(-2)}`
}

/**
 * 邮箱脱敏
 * 展示前3位(<3的全展示)***后缀，例如：wuz***@gmail.com
 */
export function encodeEmail(v) {
  if (!v) return '--'
  const arr = String(v).split('@')
  const prefix = arr[0]
  const suffix = arr[1]
  return `${prefix.slice(0, 3)}***@${suffix}`
}

/**
 * ws鉴权
 * algType：1-aes, 2-des, 3-3des
 */
export const getWsNecessary = (options) => {
  if (!options) return null
  const { algKey, algType } = options || {}
  // 加密方法
  const validMethod = {
    "1": encryptWsAES,
    "2": encryptWsDES,
    "3": encryptWs3DES
  }
  const currentValidMethod = validMethod[algType]
  // 时间戳
  const timestamp = `${Date.now()}`;
  try {
    const text = md5(timestamp)
    const key = decryptBase64(algKey)
    const token = currentValidMethod(text, key, { idMd5: true })
    return `${timestamp}-${token}`
  } catch (e) {
    return null
  }
}

// akamai鉴权
export const getAkamaiAuth = (url) => {
  // 时间戳前10位
  const timestamp = parseInt(Date.now() / 1000, 10);
  // 随机数，这里使用uuid，不能有连字符-
  const path = getPathname(url)
  const uuid = uuidv4();
  const rand = uuid.replace(/-/g, '');
  const akamaiPrivateKey = unCompileStr(getAppConfig('akamaiPrivateKey'));
  const md5hash = md5(`${path}-${timestamp}-${rand}-${akamaiPrivateKey}`)
  return `${timestamp}-${rand}-${md5hash}`
}
