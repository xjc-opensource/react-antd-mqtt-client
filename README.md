# 基于react+antd的web mqtt客户端
github地址：[基于react+antd的web mqtt客户端](https://github.com/xjc-opensource/react-antd-mqtt-client)  
预览地址：[预览地址](https://xjc-opensource.github.io/react-antd-mqtt-client)

# 1、技术栈
 - react-create-app
 - react
 - react-router
 - react-intl
 - react-load-script
 - antd
 
# 2、框架初始化
2.1 安装插件  
``` 
  npm remove -g create-react-app
  npm install -g create-react-app
  create-react-app react-antd-mqtt-client
  
  npm install --save react-router-dom  
  npm install --save react-load-script  
  npm install --save antd  
  npm install --save-dev babel-plugin-import
   
  npm install --save react-intl 
  npm install --save intl  *intl在大部分的『现代』浏览器中是默认自带的,但是Safari和IE11以下的版本没有
``` 

2.2 自定义配置构建脚本  
``` 
  npm run eject  
  须确保所有文件都已提交git,否则会报错:
     This git repository has untracked files or uncommitted changes
```
     
2.3 调整package.json配置
``` 
  # 发布目录可以非根目录: 加 "homepage": "."
  # 按需加载antd样式:
    "babel": { "presets": ["react-app" ]} 
    调整为
    "babel": { "presets": ["react-app"]
      ,"plugins": [["import",{"libraryName": "antd","style": "css"}]]
    } 
  # 调整打包输出目录(config/paths.js):
    appBuild: resolveApp('build') 
    调整为 
    appBuild: resolveApp('docs')
``` 

# 3、文件目录
```
* docs - 打包文件
* config - 环境配置文件
* public - 公用文件(不参与打包处理,打包前后文件名不变化)
* scripts - 不同环境脚本
* src - 源码文件
    * core - 
      * envconfig.js -不同环境下的变量配置
    * utils - 通用工具类
    * views - 页面
    * app.js - 页面入口
    * index.js - 加载入口
* README.md - 项目说明
* README-modify.md - 更新记录
```

# 4、开发配置
3.1 安装nodejs  
3.2 配置nodejs
``` 
  * 自定义存储位置(如:D:\nodejs)  
     npm config set prefix "D:\nodejs\node_global"  
     npm config set cache "D:\nodejs\node_cache"   
     添加操作系统环境变量: 名: NODE_PATH 值: D:\nodejs\node_global\node_modules
  * 配成国内下载地址(解决下载慢):  
     阿里: npm config set registry http://registry.npm.taobao.org
``` 
3.3 相关命令(切换至程序根目录)
``` 
    # 安装组件包 
       npm install
    # 更新组件包 
       npm update
    # 开发运行(serve with hot reload at localhost:3000)
      npm run start
    # 测试运行
      npm run test
    # 发布打包
      npm run build
    
```
3.4. 安装开发IDE - WebStorm(推荐)

#开发说明
~~~
各组件访问 GlobalEnvParams 取不同环境的配置变量
~~~

# 相关资料
* react入门教程: http://www.runoob.com/react  
* antd: https://ant.design


link:  
   weixin: chinaxjc208
