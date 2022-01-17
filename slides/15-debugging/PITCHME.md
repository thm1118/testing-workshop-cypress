## ☀️ 第 15 部分: 调试

### 📚 您将学习

- 如何调试 Cypress本身的消息
- 如何调试单个命令
- 问题的共同来源

同时参考: [on.cypress.io/debugging](http://on.cypress.io/debugging)

+++

## 出问题了

👎 文档, [Github issues](https://github.com/cypress-io/cypress/issues) 以及 [chat](https://on.cypress.io/chat) 都是获得帮助的地方.

新开一个 issue 🎉

- 可重现的代码
- 预期结果
- 录屏 / 截屏
- Cypress 内部消息

+++

典型如 `cypress open` 正常，但是 `cypress run` 不正常

+++

## 携带 `DEBUG` 运行 Cypress

停止应用服务并只运行Cypress.

```sh
DEBUG=cypress* npx cypress run --spec cypress/integration/02-adding-items/demo.js
```

注意:
在显示错误之前，您会看到 _很多_ 消息

+++

Cypress 使用 [debug](https://github.com/visionmedia/debug#readme) 模块控制 debug 命令行 消息.

阅读 [良好输出日志](https://glebbahmutov.com/blog/good-logging/)

## 尝试

```sh
# 查看命令行消息输出
DEBUG=cypress:cli npx ...
```

+++

![Debugging CLI](./img/debug-cli.png)

来自命令行模块的一些调试消息

+++

除了 `cypress:cli` 命令行模块之外，对每个包[Cypress Packages](https://github.com/cypress-io/cypress/tree/develop/packages) 都有个 DEBUG 名称 

- `cypress:launcher` - 用来查找和打开浏览器 的包
- `cypress:server` - Cypress的 ❤️ 包，控制所有事物；

以及 [其余的包](https://github.com/cypress-io/cypress/blob/develop/CONTRIBUTING.md#cypress-and-packages)

+++

## 详细的日志

**注意:** DEBUG消息有更多的级别

```sh
# 输出很少的顶级消息
DEBUG=cypress:server ...
# 打印server package中的所有消息
DEBUG=cypress:server* ...
# 仅打印配置解析消息
DEBUG=cypress:server:config ...
```

这允许您更好地隔离问题

+++

## 在浏览器中调试日志

如果在`cypress open`期间出现问题，您也可以打印调试日志. 打开浏览器DevTools

```js
localStorage.debug = 'cypress*'
// 要禁用调试消息
delete localStorage.debug
```

重新加载浏览器 "Cmd + R"

+++

![调试浏览器](./img/debug-driver.jpg)

只有在浏览器中运行"cypress:driver"包的消息

+++
## 单步测试

打开 'cypress/integration/02-adding-items/demo.js' 并添加 [cy.pause()](https://on.cypress.io/pause) 命令

```js
it('adds items', function () {
  cy.pause()
  cy.get('.new-todo')
    // ...
})
```

注意:
在每个命令执行之后，您可以观察应用程序的DOM,  network, storage ，来确保每件事如期执行.

+++

## 在测试结束后

```js
cy.now('command name', ...args)
  .then(console.log)
```

运行单个命令。将来可能会改变。

+++

## 常见问题

### 👎 Missing `--`

当调用 `npm run cy:run` ，并传入参数时，忘记使用 `--`

```sh
npm run cy:run --record --spec ...
```

这样，NPM 会"吃掉" `--record` 参数

+++

## ✅ 解决办法

用 `--` 隔离NPM和Cypress参数

```sh
npm run cy:run -- --record --spec ...
```

**注意:** 在将来, 即使你忘记用 `--`分开，我们也会努力做正确 , 查看 [#3470](https://github.com/cypress-io/cypress/issues/3470)

+++
## ✅ 解决办法

使用与现代的Node版本配套使用 [npx](https://github.com/zkat/npx) 

```sh
npx cypress run --record --spec ...
```

+++
## ✅ 解决办法

使用 [yarn run](https://yarnpkg.com/lang/en/docs/cli/run/)

```sh
yarn run cy:run --record --spec ...
```

+++

### 👎 Cypress GUI slows down on longer tests

通常是时间旅行调试较大的DOM快照造成

- 单独运行 specs, 不要运行 "Run all"
- 分割长测试
- 使用配置 [numTestsKeptInMemory](https://on.cypress.io/configuration#Global)

+++
## 使用 DevTools debugger

需要在回调中放置 `debugger` 关键字

```js
it('adds items', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  // 不能这么做！！！
  debugger
  cy.get('.todo-list li') // command
    .should('have.length', 4) // assertion
})
```

+++

```js
it('adds items', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
    .then(() => {
      // 对了！！！！
      debugger
    })
  cy.get('.todo-list li') // command
    .should('have.length', 4) // assertion
})
```

+++
## 尝试: 从回调函数调试

在`c.get('.todo-list li')` 后添加自定义期望函数，来查看返回的元素

+++

```js
cy.get('.todo-list li') // command
    .should($li => {
      console.log($li)
      debugger
    })
    .should('have.length', 4)
```

+++

## 尝试

试试 [cy.debug](https://on.cypress.io/debug) 命令

```js
cy.get('.todo-list li') // command
  .debug()
  .should('have.length', 4)
```

+++

![`cy.debug`](./img/debug-command.png)

+++

**注意:** `debugger` 和 `cy.debug` 仅仅用于 `cypress open`时，开启了DevTools.

+++
## 在`cy.task`中调试消息

在`cypress/plugins`中显示来自后端代码的调试消息

- 使用 `console.log`
- 使用 `DEBUG=...` 以及 [debug module](https://github.com/visionmedia/debug#readme)

+++
## 如果你的应用程序抛出错误

⌨️ 在 "todomvc/app.js" 里添加

```js
// 加载待办事项时抛出错误
loadTodos ({ commit }) {
  commit('SET_LOADING', true)

  setTimeout(() => {
    throw new Error('Random problem')
  }, 50)
```

+++
![Random problem](./img/random-problem.png)

Cypress捕获来自应用程序的异常

+++

### 尝试: 让我们忽略"随机问题"

在访问该页之前，请设置错误处理程序

```js
cy.on('uncaught:exception', (e, runnable) => {
  console.log('error', e)
  console.log('runnable', runnable)
  // 如果你想测试失败，返回true
})
```

+++

如果您想打印捕获的错误:

```js
beforeEach(function visitSite () {
  cy.log('Visiting', Cypress.config('baseUrl'))
  cy.on('uncaught:exception', (e, runnable) => {
    console.log('error', e)
    console.log('runnable', runnable)
    // 这种日志输出会报错
    cy.log('caught error', e)
    // 如果你想测试失败，返回true
    return false
  })
  cy.visit('/')
})
```

+++
![cy.log does not work](./img/cy-log-from-fail.png)

`cy.log` 会改变 _当前_ 命令链.
+++

你可以试着使用`Cypress.log` 代替, 但会有个问题 [#3513](https://github.com/cypress-io/cypress/issues/3513). 可以用下面的秘法输出日志

```js
cy.on('uncaught:exception', (e, runnable) => {
  console.log('error', e)
  console.log('runnable', runnable)
  cy.now('log', 'caught error', e)
  // 如果你想测试失败，返回true
  return false
})
```

+++
## 尝试: 设置全局错误处理程序

在 "cypress/support/index.js" 中

```js
Cypress.on('uncaught:exception', (e, runnable) => {
  console.log('error', e)
  console.log('runnable', runnable)
  // return true if you WANT test to fail
})
```

+++
## 如何调试 "cypress run" 失败

### 🔪 隔离问题

@ul
- 看看截屏和录屏
- 将大spec文件分割成小spec文件
- 将长测试分成短测试
- 运行时指定浏览器 `--browser chrome`
@ulend

注意:
我们正在升级与Cypress一起发布的Electron版本.

+++
## 👎 终端输出中没有命令日志

在浏览器中运行Cypress测试.

我们正在努力将测试期间的所有浏览器事件发送到终端 [#448](https://github.com/cypress-io/cypress/issues/448)

+++
## cypress-failed-log

> 如果测试失败，将Cypress测试命令日志保存为JSON文件

用户空间 插件 [bahmutov/cypress-failed-log](https://github.com/bahmutov/cypress-failed-log)

+++
## 尝试

- `cypress-failed-log` 在我们这个repo中已安装
- 跟随`cypress-failed-log` 中 README 的介绍，并开启使用

注意:
注意在`cypress/support/index.js` 中取消命令的注释，并在 `cypress/plugins/index.js` 中添加 task

+++
## 运行失败的测试

- 在 `cypress/integration/02-adding-items/demo.js` spec 中添加失败
- 从命令行运行本spec，查看命令日志

注意:
预期结果在下一张幻灯片上

+++

![Failed log](./img/failed-log.png)

`cypress-failed-log` 输出.

**注意:** 也有一个JSON文件的日志输出

+++
## 🏁 调试是很困难的

- 应用程序中的竞态条件
- Cypress中的bug
- 怪异的浏览器和服务器行为

+++
## 🏁 使用 DevTools

`debugger` 和 `cy.debug()`

_同时_ 暂停测试和应用程序

### 尝试: 演示这些

注意:
它很好地展示了`debugger`暂停 会停止所有应用程序的计时器。

+++
## 🏁 隔离问题

- 更小的spec和测试
- 失败的日志
- `DEBUG=...` 详细日志
