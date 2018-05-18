const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const { resolve, join } = require('path')
const con = require('consolidate')

const render = (lang, html, opt) => new Promise(resolve => {
  con[lang]
    .render(html, opt, (err, res) => {
      if (err) throw err

      resolve(res)
    })
})

module.exports = async function (template) {
  this.cacheable()

  const lang = template.lang
  const options = loaderUtils.getOptions(this)
  const fullPath = loaderUtils.interpolateName(this, `[path][name].[ext]`, options)
  const filename = loaderUtils.interpolateName(this, `[name].wxml`, options)
  const folder = loaderUtils.interpolateName(this, `[folder]`, options)
  const dirname = loaderUtils.interpolateName(this, `[path]`, options)
  let html = template.content

  let pathArr = dirname.replace(process.cwd(), '').split('/').filter(e => (!!e))

  const replaceObj = options.replace || {}
  const replaceKeys = Object.keys(replaceObj)

  replaceKeys.map(e => {
    pathArr = pathArr.map(m => ((m === e) ? replaceObj[e] : m)).filter(f => (!!f))
  })


  const replaceStr = pathArr.join('/')

  const dist = options.dist || 'dist'

  if (options.dist)

    if (lang) {
      let opt = {
        raw: true,
        engine: lang,
        filename: fullPath
      }

      html = await render(lang, html, opt)
    }


  fs.outputFileSync(resolve(process.cwd(), `${dist}/${replaceStr}/${filename}`), html, 'utf8')
  // fs.writeFileSync(resolve(options.path, filename), html, 'utf8')

  return ``
}