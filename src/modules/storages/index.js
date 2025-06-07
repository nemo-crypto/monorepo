import { getValueByPath, setValue } from '../utils/src/object'

export class CacheModule {
  constructor() { }
  get() {
    throw new Error('get method is not implemented')
  }

  set() {
    throw new Error('set method is not implemented')
  }
}

class StorageModule extends CacheModule {
  lazyParse = false
  options = {
    scope: ''
  }
  get scope() {
    return this.options.scope
  }
  constructor(options = {}) {
    super()
    Object.assign(this.options, options)
  }
  parse(data, useRaw) {
    let res
    try {
      res = JSON.parse(data)
    } catch (error) {
      if (useRaw) {
        res = data
      } else {
        res = null
      }
    }
    return res
  }

  fetch() {
    const scope = this.scope || ''

    if (scope) {
      const data = localStorage.getItem(scope)

      return this.parse(data) || {}
    } else {
      return localStorage
    }
  }
}

export class GlobalStorageModule extends StorageModule {
  constructor() {
    super()
    this.options.scope = ''
  }
  get(path, defaultValue) {
    const [base, ...pathes] = path.split('.')
    const baseData = this.parse(localStorage.getItem(base), true)

    if (pathes.length) {
      return getValueByPath(baseData, pathes.join('.'), defaultValue)
    } else {
      return baseData || defaultValue
    }
  }
  set(path, value) {
    const [base, ...pathes] = path.split('.')
    const baseData = this.parse(localStorage.getItem(base), true)
    const strValue = JSON.stringify(value)

    if (pathes.length) {
      setValue(baseData, path, strValue)
      localStorage.setItem(path, JSON.stringify(baseData))
    } else {
      localStorage.setItem(path, strValue)
    }
  }
}

export class ScopedStorageModule extends StorageModule {
  constructor(options) {
    super(options)
  }
  get(path, defaultValue) {
    const store = this.fetch()

    return getValueByPath(store, path, defaultValue)
  }

  replace(value) {
    localStorage.setItem(this.scope, JSON.stringify(value))
  }

  set(path, value) {
    const store = this.fetch()

    setValue(store, path, value)
    localStorage.setItem(this.scope, JSON.stringify(store))
  }

  clear() {
    localStorage.removeItem(this.scope)
  }

  checkVersion(config) {
    const { version, data } = config
    const localVersion = this.get('version') || '0.0.0'

    if (version > localVersion) {
      if (data) {
        this.replace(data)
      } else {
        this.clear()
      }
      this.set('version', version)
    }
  }
}

export class CacheData {
  modules = {}
  defaultModule = null

  options = {
    modules: [
      { name: 'storage', Module: GlobalStorageModule, isDefault: true, scoped: false },
      { name: 'preferences', Module: ScopedStorageModule, scoped: true }
    ],
    namespace: 'spot'
  }
  config = {}

  init(options = {}, config = {}) {
    Object.assign(this.options, options)
    this.config = config
    this.options.modules.forEach(item => this.register(item))
  }

  register({ name, Module, isDefault, scoped }) {
    if (this.modules[name]) {
      console.warn('重复注册，之前的 store 将被覆盖')
    }
    const scope = scoped ? `${this.options.namespace}_${name}` : name;
    const md = new Module({
      scope
    })

    if (isDefault) {
      this.defaultModule = md
    } else {
      this.modules[name] = md
      this.checkModuleVersion(name, md)
    }

    return this
  }

  checkModuleVersion(name, md) {
    if (md.checkVersion) {
      const config = this.config[name]

      if (config) {
        md.checkVersion(config)
      }
    }
  }

  get(pathStr, defaultValue) {
    const [moduleName, ...pathes] = pathStr.split('.')
    const module = this.modules[moduleName]

    if (module) {
      return module.get(pathes.join('.'), defaultValue)
    } else {
      if (this.defaultModule) {
        return this.defaultModule.get(pathStr, defaultValue)
      }
    }
  }

  set(pathStr, value) {
    const [moduleName, ...pathes] = pathStr.split('.')
    const module = this.modules[moduleName]

    if (module) {
      return module.set(pathes.join('.'), value)
    } else {
      if (this.defaultModule) {
        return this.defaultModule.set(pathStr, value)
      }
    }
  }
}

const cacheData = new CacheData()

export default cacheData

export function createStorageRequirement(project) {
  return {
    name: 'storages',
    useContext: true,
    run({ appConfig }) {
      const { storages } = appConfig
      cacheData.init({
        namespace: project || 'spot'
      }, storages)

      return cacheData
    }
  }
}
