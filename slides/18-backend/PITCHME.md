## ☀️ 第18部分: 后端代码

### 📚 您将学习

- 如何在Node上下文中执行代码

+++

- 用`npm start`启动 TodoMVC  
- 打开 `cypress/integration/18-backend/spec.js`

+++
## Cypress 架构: 浏览器

有两个 iframes: 一共用于 app, 一共用于 specs.

[on.cypress.io/key-differences](https://on.cypress.io/key-differences)

+++
![two iframes](./img/two-iframes.png)

第一个iframe运行应用程序，第二个iframe用于隔离的spec代码

+++
![iframes HTML](./img/iframes.png)

注意:
您可以同时找到iframe HTML元素. 有spec的那个iframe没有尺寸. Cypress命令日志是在顶部窗口周围的框架.

+++
![set domain](./img/set-domain.png)

注意:
为了spec iframe(来自localhost)能够访问应用程序的iframe(来自任何域), 我们在一开始就注入了这里显示的一小段JavaScript代码, 将文档域设置为`localhost`. 这使得Cypress可以访问应用程序的DOM和`window`等.

+++
![start step 1](./img/start-1.png)

注意:
Cypress以代理方式启动浏览器. 应用程序向其域发出的每个请求都要经过Cypress

+++
![start step 2](./img/start-2.png)

注意:
在Cypress将请求转发到外部域之前, 它为该域创建并注入一个自签名证书，然后转发请求.

+++
![start step 3](./img/start-3.png)

注意:
当外部服务响应页面时, Cypress注入我展示的小脚本，将文档的域设置为`localhost`

+++
![start step 4](./img/start-4.png)

spec 可以访问应用程序iframe。

注意:
之后，Cypress可以访问应用程序iframe中的所有内容, 除了来自其他域的内部框架。

+++
![start step 5](./img/start-5.png)

注意:
而且Cypress可以观察和模拟应用程序网络调用，因为它仍然是个代理。

+++
## Cypress 架构: Node

- 测试在浏览器中运行
- 如果你在测试过程中需要操作系统操作，那该怎么办?
  * 访问文件系统
  * 访问数据库

+++
![cy.task](./img/cy-task.png)

使用[`cy.task`](https://on.cypress.io/task) 运行Node代码 

+++
## 探索 task

- 用 `npm start` 运行 TodoMVC 
- 打开 `cypress/integration/18-backend/spec.js`
- 打开 `cypress/plugins/index.js` 中的 task 代码

+++
## 尝试: 写一个 "hello world" task

- 调用者将传递来自测试的名称
- task 将回复`hello ${name}`
- 测试应该确认结果

**提示:** 你可以多次调用"on('task')", 任务名称将被合并.

+++
```js
it('runs hello world', () => {
  cy.task('hello', 'world').should('equal', 'hello, world')
})
```
```js
// in plugins file
on('task', {
  hello: name => `hello, ${name}`
})
```
**注意:** Cypress 不会监控插件文件.

+++
## 意外收获

在task中 打印 `process.version` 

+++
## 尝试: 编写异步 task

变更 "runs hello world" ，返回一个 Promise.

+++
```js
on('task', {
  hello: name => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`hello, ${name}`)
      }, 1000)
    })
  }
})
```
**注意:**  Node中 没有现成的 `Cypress.Promise` Bluebird

+++
## tasks 中的重试

@ul
- 查看现有的任务`hasSavedRecord`并跟踪它所做的事情
- 编写一个调用`hasSavedRecord`的测试
- 延迟应用程序以演示该任务重试
@ulend

+++
## 重试库

你可以自己试试，或者用个库

- [promise-retry](https://github.com/IndigoUnited/node-promise-retry#readme)
- [bigtestjs/convergence](https://github.com/bigtestjs/convergence)
- [wait-for-expect](https://github.com/TheBrainFamily/wait-for-expect)

+++
## 动态 tasks

让一个 task 创建新 tasks

```js
it('makes task and runs it', () => {
  function hello (name) {
    return 'hello, ' + name
  }
  cy.task('eval', hello.toString())
  cy.task('hello', 'eval').should('equal', 'hello, eval')
})
```

+++
```js
on('task', {
  eval (newTaskFn) {
    const name = newTaskFn.match(/^function (\w+)/)[1]
    const newTask = /* js */ `
      on('task', {
        ${name}: ${newTaskFn}
      })
    `
    eval(newTask)
    return null
  }
})
```
**提示:** 使用 "Comment tagged templates" ， `/* js */`来语法高亮 

注意:
虽然这是可能的，但您仍然只是向后端发送一个字符串, 因此，linter无法告诉您发送的代码是否有意义.

+++
## 🏁 架构

在浏览器中有两个由Cypress控制的iframe。spec能完全访的应用程序。

+++
## 🏁 架构

Node上下文与浏览器上下文强隔离. 用 `cy.task` 穿越边界.

- 测试前初始化数据
- 测试过程中检查外部服务
