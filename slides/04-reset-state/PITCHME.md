## ☀️ 第4部分: 重置状态数据

### 📚 您将学习

- 一个测试如何通过留下它的数据来影响另一个测试
- 测试期间何时以及如何重置状态

+++

- 保持 `todomvc` app 运行
- 打开 `cypress/integration/04-reset-state/spec.js`
- 如果您再次加载测试，它就会失败 😕

+++

![第一次测试运行](./img/passing-test.png)

+++

![第二次测试运行](./img/failing-test.png)

+++

![检查XHR第一次调用](./img/inspect-first-get-todos.png)

+++

```javascript
beforeEach(() => {
  cy.visit('/')
})
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}
it('adds two items', () => {
  addItem('first item')
  addItem('second item')
  cy.get('li.todo').should('have.length', 2)
})
```

+++

## 提问

- 如何重置数据库?
  - **提示** 我们当前使用的是 [json-server-reset](https://github.com/bahmutov/json-server-reset#readme) middleware
  - 尝试从命令行重置它

```
$ http POST :3000/reset todos:=[]
```

注意:
我使用 httpie 发送空列表，来轻松重置数据库.

+++

- 如何在Cypress中发起使任意跨域XHR请求 ?
- 每次测试前重置数据库
  - 修改 `04-reset-state/spec.js` 调用XHR重置数据库
  - 在 `cy.visit` 之前还是之后 ?

注意:
学生应该修改 `cypress/integration/04-reset-state/spec.js` 并在每次测试使用之前`before` ，使用`cy.request`重置数据库.

这个和其他TODO作业的答案在里面 [cypress/integration/04-reset-state/answer.js](/cypress/integration/04-reset-state/answer.js) .

+++
## 使用 cy.writeFile

```
"start": "json-server --static . --watch data.json"
```

如果我们覆盖 `todomvc/data.json` 并重启 应用，可以看到新数据

+++
## 尝试: 使用 cy.writeFile 来重置所有事项

```js
describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    // TODO write file "todomvc/data.json" with stringified todos object
    cy.visit('/')
  })
  ...
})
```

查看 [`cy.writeFile`](https://on.cypress.io/writefile)

+++
确保您正在编写正确的文件.

![参见写入的文件路径](./img/write-file-path.png)

注意:
最常见的错误是使用相对于spec文件的文件路径, 应该是相对于项目的根目录.

+++
## 使用 cy.task

您可以通过调用 [`cy.task`](https://on.cypress.io/task) 来在浏览器测试期间执行Node代码

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('task', {
    hello(name) {
      console.log('Hello', name)
      return null // or Promise
    }
  })
}
// cypress/integration/spec.js
cy.task('hello', 'World')
```

+++
## 尝试： 使用 cy.task重置数据

在cypress/plugins/index.js 中 查找 "resetData" 任务 

```js
describe('reset data using a task', () => {
  beforeEach(() => {
    // call the task "resetData"
    cy.visit('/')
  })
})
```

+++
## 尝试 使用 cy.task 设置数据

调用 `cy.task('resetData')` 时，传入对象

```js
it('sets data to complex object right away', () => {
  cy.task('resetData', /* object*/)
  cy.visit('/')
  // check what is rendered
})
```

+++
## 尝试 用 fixture 设置数据

调用 `cy.task('resetData')` 时，传入对象

```js
it('sets data using fixture', () => {
  // load todos from "cypress/fixtures/two-items.json"
  // and the call the task to set todos
  cy.visit('/')
  // check what is rendered
})
```

+++

## 最佳实践

- 每次测试前重置状态
  - 我们的 [最佳实践指南](https://on.cypress.io/best-practices)
- 使用 [`cy.request`](https://on.cypress.io/request), [`cy.exec`](https://on.cypress.io/exec), [`cy.task`](https://on.cypress.io/task)
- 观看演示 "Cypress: 超越 Hello World测试" [https://slides.com/bahmutov/cypress-beyond-the-hello-world](https://slides.com/bahmutov/cypress-beyond-the-hello-world)
