var os      = require('os')
    process = require('process')
    fs = require('fs')
    path = require('path')

var eol = os.EOL
    cwd = process.cwd()

var filefunc = require('./FileFunc')

// Create for Bandix ONLY
module.exports = function (src) {
  //read swagger
  let file = filefunc.readFile(src)
  let json = JSON.parse(file)
  let _path = path.join(cwd, 'src', 'shooter')
  // init apidir
  let apitar = path.join(cwd, 'src', 'shooter', 'api')
  //create api file
  let aTags = json.tags
  if (!filefunc.exists(apitar)) {
    console.log('Not Found \'api\' directory, you must init api manager with Shoot!')
    return
  }
  let np = []
  aTags.forEach(tag => {
    let n = tag.name;d = tag.description
    console.log('Shooter! creating ' + n + '...')
    filefunc.append(path.join(_path, 'index.js'), `import ${n}Api from './api/${n}Api'\r`)
    np.push(n+'Api')
    let apiTem = filefunc.loadTemplate('api.template')
    apiTem = apiTem.replace(/\{apiName\}/g, n)
    apiTem = apiTem.replace(/\{description\}/g, d)
    filefunc.writeFile(path.join(apitar, n + 'Api.js'), apiTem, 0666)
  })
  filefunc.append(path.join(_path, 'index.js'), `\rexport { ${np.join(',')} }`)
  // add headers in config
  if (!filefunc.exists(_path, 'config.js')) return
  // let conFile = filefunc.readFile(path.join(_path, 'config.js'))
  let consumes = `${eol}export const CONSUMES = {'content-type': '${json.consumes[0]}'}`
      produces = `${eol}export const PRODUCES = {'content-type': '${json.produces[0]}'}`
  fs.appendFileSync(path.join(_path, 'config.js'), consumes)
  fs.appendFileSync(path.join(_path, 'config.js'), produces)
  // read paths
  let paths = json.paths
  for (let aths in paths) {
    console.log('now writing' + aths)
    //1. get url
    if (/\{|\}/.test(aths) === true) {
      var url = `\`${aths.replace(/\{(\S*)\}/, '${' + aths.match(/\{(\S*)\}/)[1] + '}')}\``
    } else {
      var url = `'${aths}'`
    }
    //2. get method and then
    for (let met in paths[aths]) {
      // load tem
      let funTem = filefunc.loadTemplate('s.template')
      // add url
      funTem = funTem.replace(/\{url\}/g, url)
      // add data
      if (/\$\{|\}/.test(url) === true) {
        funTem = funTem.replace(/\{data\}/g, `${url.match(/\$\{(\S*)\}/)[1]}, {params}`)
      } else {
        funTem = funTem.replace(/\{data\}/g, `{params}`)
      }
      // add method
      let method = met
      funTem = funTem.replace(/\{method\}/g, method)
      // add func name
      if (paths[aths][met]['apiMethod']) funTem = funTem.replace(/\{funcName\}/g, paths[aths][met]['apiMethod'])
      else funTem = funTem.replace(/\{funcName\}/g, met + (aths.split('/')[aths.split('/').length-1].toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())))
      // add summary
      funTem = funTem.replace(/\{summary\}/g, paths[aths][met]['summary'])
      // add header
      if (paths[aths][met]['consumes']) {
        let header = `header: {'Content-Type': '${paths[aths][met]['consumes'][0]}'},`
        funTem = funTem.replace(/\{header\}/g, header)
      } else funTem = funTem.replace(/\{header\}/g, '')
      // add params
      let paras = paths[aths][met]['parameters']
      let pt = ''
      if (typeof paras == 'object' && paras.length > 0) {
        for (let item=0;item<paras.length;item++) {
          if (paras[item].in == 'path') {}
          else {
            let param = paras[item].name
            pt = pt + param + ', '
          }
        }
      }
      pt = pt.substring(0, pt.lastIndexOf(','))
      funTem = funTem.replace(/\{params\}/g, pt)
      funTem = funTem.replace(/\n(\n)*( )*(\n)*\n/g, '\n')
      // 3. find api file
      let file = path.join(cwd, 'src', 'shooter', 'api', paths[aths][met]['tags'][0] + 'Api.js')
      let apiTem = filefunc.readFile(file)
      apiTem = apiTem.replace('  //shootMark', eol+funTem)
      filefunc.writeFile(file, apiTem)
    }
    console.log('complete' + aths)
  }
}
