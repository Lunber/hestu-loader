const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const { resolve } = require('path')
const sass = require('node-sass')

const con = {
  stylus: (file, data) => new Promise(resolve => {
    require('stylus').render(data, { filename: file }, (err, css) => {
      if (err) throw err
        
      resolve(css)
    }) 
  }),
  less: (file, data) => new Promise(resolve => {
    require('less').render(data, {}, (err, result) => {
      if (err) throw err

      resolve(result.css)
    }) 
  }),
  scss: (file, data) => new Promise(resolve => {
    require('node-sass').render({
      file, 
      data,
      outputStyle: 'compressed'
    }, (err, result) => {
      if (err) throw err

      resolve(result.css)
    }) 
  }),
  sass: (file, data) => new Promise(resolve => {
    require('node-sass').render({
      file, 
      data,
      outputStyle: 'compressed',
      indentedSyntax: true
    }, (err, result) => {
      if (err) throw err

      resolve(result.css)
    }) 
  })
}


module.exports = async function (style) {
  this.cacheable()

  const options = loaderUtils.getOptions(this)
  const filenameExt = {
    wechat: 'wxss',
    baidu: 'css',
    baidu: 'acss'
  }[options.mode || 'wechat']
  const pullPath = loaderUtils.interpolateName(this, `[path][name].[ext]`, options)
  const filename = loaderUtils.interpolateName(this, `[name].${filenameExt}`, options)
  const folder = loaderUtils.interpolateName(this, `[folder]`, options)
  const dirname = loaderUtils.interpolateName(this, `[path]`, options)
  const dist = options.dist || 'dist'

  // 用replace(/\\/g,'/') 兼容windows路径
  let pathArr = dirname.replace(process.cwd().replace(/\\/g,'/'), '').split('/').filter(e => (!!e))
  
  const replaceObj = options.replace || {}
  const replaceKeys = Object.keys(replaceObj)

  replaceKeys.map(e => {
    pathArr = pathArr.map(m => ((m === e) ? replaceObj[e] : m)).filter(f => (!!f))
  })

  const replaceStr = pathArr.join('/')

  let stylesheet = style.content
  let lang = style.lang

  if (lang) {
    const render = con[style.lang]

    stylesheet = await render(pullPath, stylesheet)
  }

  fs.outputFileSync(resolve(process.cwd(), `${dist}/${replaceStr}/${filename}`), stylesheet)

  return ``
}

