## ☀️ 第16部分: 预处理器

预处理器是负责为浏览器准备支持文件或测试文件的插件.

+++
### 📚 您将学习

- 构建spec时如何更改选项
- 如何使用TypeScript 的specs

+++
## 不包括

编写自己的预处理器, 查看 [on.cypress.io/preprocessors-api](https://on.cypress.io/preprocessors-api) 来获知如何编写

+++

- 使用`npm start` 启动 TodoMVC  
- 打开 `cypress/integration/16-preprocessors/spec.js`

+++
## Specs

默认捆绑了 [Cypress browserify 预处理器](https://github.com/cypress-io/cypress-browserify-preprocessor)

或者你能使用 [Cypress webpack 预处理器](https://github.com/cypress-io/cypress-webpack-preprocessor)

+++
## 默认选项

```sh
npm i -D @cypress/browserify-preprocessor
```
```js
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
module.exports = (on, config) => {
  on('file:preprocessor', browserify())
}
```

+++
## 变更选项

```js
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
module.exports = (on, config) => {
  const options = browserify.defaultOptions
  options.foo = 'my value'
  on('file:preprocessor', browserify(options))
}
```

注意:
与其指定所有新选项，不如修改默认选项中的深层属性.

+++
## 尝试: 打印所有默认选项

添加`debug`调用来显示用于捆绑spec文件的默认browserify选项

```js
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
// convention: use name of the repo
const debug = require('debug')('testing-workshop-cypress')
module.exports = (on, config) => {
  const options = browserify.defaultOptions
  // try %o - prints object on a single line
  // or %O - prints object on multiple lines
  debug('browserify options %o', options)
  on('file:preprocessor', browserify(options))
}
```

+++

![Default options](./img/default-options.png)

+++
我们需要打印更深的选项。使用 `DEBUG_DEPTH=10`

![Default options deep](./img/default-options-deep.png)

+++

默认情况下包含2个转换器

- [coffeeify](https://github.com/jnordberg/coffeeify) 无选项
- [babelify](https://github.com/babel/babelify) 带有插件和预设
  * `babel-plugin-add-module-exports`
  * `plugin-proposal-class-properties`
  * `plugin-proposal-object-rest-spread`
  * `@babel/preset-env`
  * `@babel/preset-react`

看看在`spec.js`中待编译的测试代码，包括JSX

+++

## 尝试: 添加 Babel 插件

让我们在spec中启用 [`do` 注解]() 

⌨️ 测试 "transpiles do expression"

+++

```js
const options = browserify.defaultOptions
const babelOptions = options.browserifyOptions.transform[1][1]
const babelPlugins = babelOptions.plugins
babelPlugins.push('@babel/plugin-proposal-do-expressions')
on('file:preprocessor', browserify(options))
```

+++
## 👍 可选: 添加 .babelrc 文件

创建 `.babelrc` 文件
```json
{
  "plugins": [
    "@babel/plugin-proposal-do-expressions"
  ]
}
```
并启用 `babelOptions.babelrc = true` 选项.

注意:
插件列表是 默认选项和`.babelrc`列表的合并.

+++
## 尝试: 添加自己的插件

在[https://babeljs.io/docs/en/next/plugins](https://babeljs.io/docs/en/next/plugins) 中找一个插件 并将其添加到Babel插件中，并编写使用新注解的测试. 优秀候选插件有

- function bind
- pipeline operator
- optional chaining

+++
## Browserify TypeScript specs

基于 [TypeScript with Browserify](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify) 示例配方.

打开测试文件 `ts-example.ts`

+++

![TypeScript error](./img/ts-error.png)

+++

**尝试:** 在`plugins/index.js` 中使用 Browserify 插件 `tsify` 来编译 TypeScript specs

- 需要安装TypeScript和插件
- 需要设置预处理器
- 需要有 `tsconfig.json`

**提示:** [TypeScript with Browserify](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify) 例子配方

**提示:** 注意终端中出现的错误信息

+++
## 安装

```sh
npm i -D typescript tsify
```

+++

## 预处理器

```js
// plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
const options = {
  browserifyOptions: {
    extensions: ['.js', '.ts'],
    plugin: [['tsify']]
  }
}
on('file:preprocessor', browserify(options))
```

+++
## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "skipLibCheck": true, // do not check types in node_modules folder
    "strict": true
  },
  "include": [
    "node_modules/cypress",
    "cypress/**/*.ts"
  ]
}
```

+++
## TypeScript 和 Webpack

查看 [Preprocessors TypeScript with Webpack](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack) 示例配方

可以使用 [bahmutov/add-typescript-to-cypress](https://github.com/bahmutov/add-typescript-to-cypress) 来设置.

+++
## 常见 TypeScript 问题

- 第三方冲突 `@types` 的修订  [#3371](https://github.com/cypress-io/cypress/issues/3371)
- Jest vs Chai `expect` 全局
- 错误的类型定义
- 转译 `plugins/index` 自身

+++
## 📖 TypeScript 深入

阅读免费电子书 [basarat.gitbooks.io/typescript](https://basarat.gitbooks.io/typescript/)

有一个伟大的Cypress部分 [/testing/cypress.html](https://basarat.gitbooks.io/typescript/docs/testing/cypress.html)

+++
## 👍 使用Webpack预处理器

如果您的项目已经使用 `webpack.config.js`

```sh
npm i -D @cypress/webpack-preprocessor
```
```js
const webpack = require('@cypress/webpack-preprocessor')
module.exports = (on) => {
  const options = {
    // send in the options from your webpack.config.js,
    // so it works the same as your app's code
    webpackOptions: require('../../webpack.config'),
    watchOptions: {},
  }
  on('file:preprocessor', webpack(options))
}
```

+++
## 🏁 您可以控制如何编译spec文件

- 修改默认的browserify选项
- 覆盖或使用Webpack bundle
