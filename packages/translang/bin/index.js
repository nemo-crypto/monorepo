#!/usr/bin/env node

/**
 * xlsx自动转换覆盖语言文件
 * xlsx 要更新的xlsx所在路径
 * sheets xlsx所属sheets的key
 * locales 本地语言文件路径
 * 
 * xlsx文件示例
 * -----------------------
 * | Key | en-US | zh-CN |
 * -----------------------
 * | name | name |  姓名  |
 * -----------------------
 */

// 获取命令行参数
const getArgv = key => {
  for (let item of process.argv) {
    if (item.startsWith(key)) {
      return item.split('=')[1]
    }
  }
}

const XLSX = require('xlsx')
const fs = require('fs')
const { Sheets } = XLSX.readFile(getArgv('--xlsx'))
const xlsxKey = Sheets[getArgv('--sheets')]
const data = XLSX.utils.sheet_to_json(xlsxKey, { header: 1 })

// 数据转换
const thead = data.splice(0, 1)[0]
const langs = Object.values(thead).slice(1)
const tbody = []
data.forEach(tr => {
  let item = {}
  for (let key in tr) {
    item[thead[key]] = tr[key]
  }
  tbody.push(item)
})

// 数据key
const languageKeys = {}
tbody.forEach(tr => {
  languageKeys[tr.Key] = ""
})

// 生成需要生成的数据 - key
const updateLangData = {}
langs.forEach(lang => {
  updateLangData[lang] = { ...languageKeys }
})

// 生成需要生成的数据 - value
tbody.forEach(tr => {
  for (let key in tr) {
    if (updateLangData[key]) {
      updateLangData[key][tr.Key] = tr[key].replace(/\n/g, '')
    }
  }
})

// 读取历史数据
const historyLangData = {}
langs.forEach(lang => {
  try {
    historyLangData[lang] = JSON.parse(fs.readFileSync(`${getArgv('--locales')}/${lang}.json`, 'utf8'))
    console.log(`读取历史文件：${getArgv('--locales')}/${lang}.json`)
  } catch (e) {
    console.log(`读取历史文件失败：${getArgv('--locales')}/${lang}.json`)
  }
})

// 合并历史数据 + 更新数据
const langData = {}
for (let lang in historyLangData) {
  let resultData = historyLangData[lang]
  let updateData = updateLangData[lang]
  for (let key in updateData) {
    // 历史已存在key
    if (resultData[key]) {
      // 如果新数据有值则覆盖，否则不做修改
      if (updateData[key]) {
        resultData[key] = updateData[key]
      }
    } else {
      resultData[key] = updateData[key]
    }
  }
  langData[lang] = resultData
}

// 修改对应语言文件
for (let lang in langData) {
  fs.writeFileSync(`${getArgv('--locales')}/${lang}.json`, JSON.stringify(langData[lang], null, 2), 'utf8')
  console.log(`修改语言文件：${getArgv('--locales')}/${lang}.json`)
}

console.log('==================== Success ====================')
