import i18n from '../packages/translation/locales/index-build.js'
import glob from 'glob'
import fs from 'fs'

const paths = ['./src/**/*.js', './packages/**/*.js']

let keys = {}
let total = 0
let totalUnique = 0

// 待解析的文件数
let toParseNumber = 0
// 匹配 $t('string', ...) 和 $t("string", ...)
const reg = /\$t\(['"](.*?)['"][),]/g
paths.forEach(p => {
  glob.sync(p).forEach(file => {
    ++toParseNumber
    fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      for (let match = reg.exec(data); match; match = reg.exec(data)) {
        // \' 替换为 ', \" 替换为 ", \\ 替换为 \
        let text = match[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        ++total
        if (!(text in keys)) {
          ++totalUnique
          keys[text] = 0
        }
      }
      if (--toParseNumber == 0) {
        onParse()
      }
    })
  })
})
// 文件解析结束
function onParse() {
  console.log(`----------------------------------------
文件解析完毕，发现多语言文本 ${total} 条, 去重后还剩 ${totalUnique} 条。
  `)

  for (let locale in i18n) {
    let data = i18n[locale]
    console.log(`\n-------------------- ${locale} --------------------`)
    console.log(`可能缺少翻译：`)
    for (let key in keys) {
      if (data[key]) {
        // 记录拥有翻译的 locale 数
        ++keys[key]
      } else {
        data[key] = i18n.en_US[key] || key
        console.log(data[key])
      }
    }

    // 删除多余翻译
    console.log(`\n删除多余翻译：`)
    for (let key in data) {
      if (!(key in keys)) {
        console.log(key)
        delete data[key]
      }
    }
    
    // 输出翻译文件
    fs.writeFile(`./packages/translation/locales/${locale.replace(/_/, "-")}.json`, JSON.stringify(data, Object.keys(data).sort(), 2) + '\n', err => {
      err && console.error(err)
    })
  }
  
  console.log('\n==== 翻译结束 ====')
}