## ☀️ 第10部分:配置

### 📚 您将学习

- 如何控制Cypress参数
- 如何将环境变量传递给测试

+++

## 配置能够设置

- `baseUrl`
- `env`
- `reporter`
- `video`
- 以及非常多的选项

+++

Cypress 选项可以通过以下方式设置:
- `cypress.json`
- 命令行参数
- 环境变量
- 在插件代码中
- 在运行时

+++

## 问题

> 配置文档在哪里?

注意:
你应该在 [https://on.cypress.io/configuration](https://on.cypress.io/configuration)中查找配置说明

+++

## `cypress.json`

打开 `cypress.json` 并检查在这个项目中设置了哪些选项.

```json
{
  "viewportWidth": 400,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000"
}
```

+++

**提示:** 如果你有很多选项要覆盖, 使用 `--config-file <...>` 参数来替代 `cypress.json`.

+++

## `cypress.json` 编写时智能感知

![`cypress.json`在VSCode智能感知](./img/cypress.json-intellisense.png)

你可以在在现代编辑器中 智能感知方式编辑`cypress.json` ，比如VSCode.

+++

## VSCode

在用户设置、全局设置或工作空间设置中

```json
{
  "json.schemas": [
    {
      "fileMatch": ["cypress.json"],
      "url": "https://on.cypress.io/cypress.schema.json"
    }
  ]
}
```

阅读: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)

+++

## VSCode (可选)

在 `cypress.json`中添加 `$schema`属性

```json
{
  "viewportWidth": 600,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000",
  "$schema": "https://on.cypress.io/cypress.schema.json"
}
```

阅读: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)

+++

## 命令行参数

使用 `--config` flag，可以覆盖默认 `cypress.json` 配置 

```shell
npx cypress open \
  --config baseUrl=http://todomvc.com/examples/dojo/,defaultCommandTimeout=10000
```

注意:
尝试运行 `cypress/integration/02-adding-items/demo.js` spec.
通常使用 `cypress run` 命令 (specific spec, longer timeouts)

+++

## package scripts

**警告 ⚠️** 如果你通过NPM包脚本启动Cypress, 使用 `--` 来添加命令行参数.

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

```shell
npm run cy:run -- --config baseUrl=http://todomvc.com/examples/dojo/
```

+++

## 环境变量

通过以`CYPRESS_`起头的环境变量可覆盖 `cypress.json` 配置 

```shell
CYPRESS_baseUrl=http://todomvc.com/examples/dojo/ npx cypress open
# same
CYPRESS_BASE_URL=http://todomvc.com/examples/dojo/ npx cypress open
```

注意: 优先级
`cypress.json` < 环境变量 < CLI参数

+++

## 环境变量

在CI上使用环境变量. 特别是传递私有record密钥!

```shell
# bad practice, can accidentally show up in STDOUT
npx cypress run --record --recordKey abc...
# good
CYPRESS_RECORD_KEY=abc...
npx cypress run --record
```

+++

## 插件代码

在 `cypress/plugins/index.js`中

```js
module.exports = (on, config) => {
  config.baseUrl = 'http://todomvc.com/examples/dojo/'
  // change more options ...
  return config
}
```

文档: [https://on.cypress.io/configuration-api](https://on.cypress.io/configuration-api)

+++

## 插件代码

您可以返回一个已解析的配置作为承诺。

```js
module.exports = (on, config) => {
  return new Promise((resolve, reject) => {
    // load config from file or network
    resolve(loadedConfig)
  })
}
```

+++

## 运行时配置

您可以使用[Cypress.config](https://on.cypress.io/config) 为每个spec 设置配置.

```js
Cypress.config('baseUrl', 'http://todomvc.com/examples/dojo/')
beforeEach(function visitSite () {
  cy.log('Visiting', Cypress.config('baseUrl'))
  cy.visit('/')
})
```

注意:
使用风险由您自己承担，因为每个测试中的突变顺序和最终配置可能会令人困惑.

+++

## 解析的配置

![resolved configuration](./img/configuration.png)

+++

## 配置优先级

`cypress.json` < 环境变量 < CLI参数 < 插件 < 运行时

+++

## 尝试

在无头模式下运行一个spec:
- `localhost`
- `http://todomvc.com/examples/dojo/`

+++

## 环境变量s

*这些不是Cypress的配置* - username, passwords, etc.

指南 [https://on.cypress.io/environment-variables](https://on.cypress.io/environment-variables)

+++

## 环境变量

### `cypress.json` "env"

```json
{
  "baseUrl": "http://localhost:3000",
  "env": {
    "todoTitle": "env todo"
  }
}
```
```js
it('has env item', function () {
  expect(Cypress.env('todoTitle'))
    .to.equal('env todo')
})
```

+++

## 环境变量

### `cypress.env.json`

```json
{
  "eyes": "brown",
  "t-shirt": "large"
}
```

环境变量将被合并。

+++

## 使用env变量

```js
Cypress.env() // returns entire merged object
Cypress.env(name) // returns single value
```

查看 [https://on.cypress.io/env](https://on.cypress.io/env)

+++

## 尝试: 获取深度属性

Given `cypress.env.json`

```json
{
  "person": {
    "name": "Joe"
  }
}
```

从测试中断言该名称确实是`Joe`.

注意:
使用 `Cypress._.get` 或 `cy.wrap(Cypress.env()).its('person.name')`

+++

## 环境变量

### 命令行参数

```sh
npx cypress open --env todoTitle="env todo",life=42
```

+++

![env variables from CLI](./img/env-from-cli.png)

+++

## 尝试

通过命令行参数传递一个对象，并在配置中查看

```sh
npx cypress open --env ???
```

+++

## 环境变量

### 环境变量 🙂

```sh
CYPRESS_todoTitle="env todo" CYPRESS_name=CyBot \
  npx cypress open
```

未知的 `CYPRESS_` 变量将被添加到 `env` 对象.

+++

![env variables from env](./img/env-from-env.png)

+++

## 环境变量

### 插件

```js
module.exports = (on, config) => {
  config.env.fooBar = 'baz'
  return config
}
```

+++

## 环境变量

### 运行时

```js
it('has env', () => {
  Cypress.env('life', 1)
  expect(Cypress.env('life')).to.equal(1)
  // change multiple values
  Cypress.env({
    life: 1,
    state: 'busy'
  })
})
```

+++

## 环境变量

🛑 无法在运行时使用`Cypress.config('env', ...)` 更改环境变量 

```js
it('has env', () => {
  expect(Cypress.env('life')).to.equal(42)
  Cypress.config('env', {
    life: 1
  })
  // nope, remains the same
  expect(Cypress.env('life')).to.equal(42)
})
```

✅ 总是使用 `Cypress.env(name, value)` 来改变环境变量.

+++

## 尝试: 为每个环节 配置

问题:让我们为每个环境创建配置设置，并使用CLI参数加载它们。

```sh
npx cypress open --env staging
npx cypress open --env prod
```

应该从`configs/staging.json` 或 `configs/prod.json` 加载.

注意:
你会在每个JSON文件中设置什么选项?
它们会与 `cypress.json`中的其他设置合并吗??
答案在  https://on.cypress.io/configuration-api

+++

## 总结

+ `--config-file <json filepath>`

| `config` | `env` |
| -------- | ----- |
| `cypress.json` | `cypress.json` |
| command line | command line |
| environment | environment |
| plugin | plugin |
| run-time | run-time |
| | `cypress.env.json` |
