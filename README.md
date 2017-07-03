# shoot-generator

自用偷懒工具，搭配Bandix使用（但是现在没有）
```sh
npm install -g shoot-generator
```


```
  Usage: shoot <command>


  Commands:

    init   init your ApiManaer (with Bandix or vue program).
    keep   Keep Shoot! press "exit" and stop!

  Shoot your API in Manager! Also with Bandix! NOW HERE WE GO!

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -a, --add <file>  Add a api file into api folder.
    -i, --import      import a api json into Manager.
```

通过`shoot init`初始化
```sh
shoot init
```

通过`shoot keep`持续输入要生成的请求方法
```sh
shoot keep

# > <url> <name> <path> <method> <data>
# 按顺序输入
```

通过`shoot -a`添加api模块文件
```sh
shoot -a <file>
# shoot -a defaultApi.js
```