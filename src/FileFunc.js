var path   = require('path')
    fs     = require('fs')
    mkdirp = require('mkdirp')

module.exports = {
  copyTemplate: function (src, tar) {
    src = path.join(__dirname, '..', 'template', src)
    this.writeFile(tar, fs.readFileSync(src, 'utf-8'))
  },

  loadTemplate: function (src) {
    return fs.readFileSync(path.join(__dirname, '..', 'template', src), 'utf-8')
  },

  exists: function (path) {
    let exist = fs.existsSync(path)
    return exist
  },

  writeFile: function (data, str, mode) {
    fs.writeFileSync(data, str, {mode: mode || 0666})
    console.log('write file: ' + data)
  },

  readFile: function (src) {
    return fs.readFileSync(src, 'utf-8')
  },

  mkdir: function (path, cb) {
    mkdirp(path, 0755, function(err) {
      if (err) console.log(err)
      console.log('create folder: ' + path)
      cb && cb()
    })
  }
}
