var os      = require('os')
var process = require('process')
var fs      = require('fs')
var path    = require('path')

var eol = os.EOL
var cwd = process.cwd()
var space = '            '

var filefunc = require('./FileFunc')

 //PHP Version, so no Bandix.
module.exports = function (src) {
  //read swagger
  let file = filefunc.readFile(src)
  let json = JSON.parse(file)
  let _path = path.join(cwd, 'shooter_php')
  // init apidir
  let apitar = path.join(cwd, 'shooter_php', 'router')
  var rouTem = filefunc.loadTemplate('pr.template')
  //create api file
  if (!filefunc.exists(apitar)) filefunc.mkdir(apitar)
  let aTags = json.tags
  for (let tag=0;tag<aTags.length;tag++) {
    console.log('Shooter! creating ' + aTags[tag].name + '...')
    //load template
    var apiTem = filefunc.loadTemplate('pra.template')
    // get name
    let n = aTags[tag].name
    let aparr = []
    apiTem = apiTem.replace(/\{apiName\}/g, n)
    //read path
    let paths = json.paths
    for (let aths in paths) {
      let pararr = []
      // console.log('now writing' + aths)
      // 1. get url
      let url = aths
      // 2. get method
      for (let met in paths[aths]) {
        if (paths[aths][met]['tags'][0] === n) {
          let method = met;methodName = paths[aths][met]['apiMethod']
          pararr.push(`[${method.toUpperCase()}`, `'${url}'`, `'${methodName}']`)
          aparr.push(pararr)
        }
      }
    }
    apiTem = apiTem.replace(/\{apiFunction\}/g, '[' + aparr + ']')
    rouTem = rouTem.replace('//shootMark', apiTem)
    // console.log(apiTem)
  }
  rouTem = rouTem.replace('//shootMark', '')
  filefunc.writeFile(path.join(apitar, 'route.php'), rouTem)
}
