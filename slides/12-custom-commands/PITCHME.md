## ☀️ 第12部分:自定义命令

### 📚 您将学习

- 为`cy` 添加新命令 
- 支持重试能力
- 新命令的TypeScript定义方式
- 有用的第三方命令

+++

- 保持 `todomvc`持续运行
- 打开 `cypress/integration/12-custom-commands/spec.js`

+++

### 💯 代码重用和清晰性

```js
beforeEach(function resetData () {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite () {
  cy.visit('/')
})
```

注意:
在每次测试之前，我们需要重置服务数据并访问页面. 数据清理和打开站点可能比我们的简单示例复杂得多. 我们可能想把`resetData` 和 `visitSite` 分解成每个spec和测试都可以使用的可重用函数.

+++

### 尝试: 把它们移到 `cypress/support/index.js` 

现在这些`beforeEach`钩子将在每个spec中的每个测试之前加载。

注意:
这是一个好解决方案吗?

+++

### 尝试: 把它们移到 `cypress/support/hooks.js`

并在spec文件中加载:

```js
// automatically runs "beforeEach" hooks
import '../../support/hooks'

it('enters 10 todos', function () {
  ...
})
```

注意:
这是一个更好的解决方案，因为只有需要这些钩子的spec文件才会加载它们.

+++

### 尝试: export `resetData` 和 `visitSite`

```js
// cypress/support/hooks.js
export function resetData () { ... }
export function visitSite () { ... }
```

⌨️ 并更新 `spec.js`

+++

## 我的意见

> 小的可重用函数是最佳的

```js
import {
  enterTodo, getTodoApp, getTodoItems, resetDatabase, visit
} from '../../support/utils'
it('loads the app', () => {
  resetDatabase()
  visit()
  getTodoApp().should('be.visible')
  enterTodo('first item')
  enterTodo('second item')
  getTodoItems().should('have.length', 2)
})
```

注意:
有些函数可以返回`cy`实例，有些不能，只要方便就行. 我还发现返回复杂选择器的小函数对于防止选择器重复非常有用.

+++

益处: 函数很容易用JSDoc文档注释

![JSDoc example](./img/jsdoc.png)

+++

然后代码智能感知能立即生效

![IntelliSense](./img/intellisense.jpeg)


+++

并且MS Typescript智能感知可以从JSDoc中理解并检查类型!

[https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript)

更多的细节在: [https://slides.com/bahmutov/ts-without-ts](https://slides.com/bahmutov/ts-without-ts)

+++

## 自定义命令的应用场景

- 在整个项目中共享代码，而不需要单独导入
- 复杂的逻辑与自定义命令日志输出
  * 登录需要的系列过程
  * 繁杂的应用程序操作

📝 [on.cypress.io/custom-commands](https://on.cypress.io/custom-commands)

+++

让我们编写一个自定义命令来创建 待办事项

```js
// 替换下面代码
cy.get('.new-todo')
  .type('todo 0{enter}')
// 成这样
cy.createTodo('todo 0')
```

+++

## 尝试: 编写和使用 "createTodo"

```js
Cypress.Commands.add('createTodo', todo => {
  cy.get('.new-todo').type(`${todo}{enter}`)
})
it('creates a todo', () => {
  cy.createTodo('my first todo')
})
```

+++

## ⬆️ 使之更好

- 能智能感知`createTodo`
- 有更好的命令日志输出

+++

## 尝试: 添加 `createTodo` 到 `cy` 对象

如何做: [https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense)

+++

⌨️ 在文件 `cypress/integration/12-custom-commands/custom-commands.d.ts`中

```ts
/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Creates one Todo using UI
     * @example
     * cy.createTodo('new item')
     */
    createTodo(todo: string): Chainable<any>
  }
}
```

+++

在 `cypress/integration/12-custom-commands/spec.js` 中加载新定义文件

```js
/// <reference path="./custom-commands.d.ts" />
```

+++

![Custom command IntelliSense](./img/create-todo-intellisense.jpeg)

更多的 JSDoc 例子: [https://slides.com/bahmutov/ts-without-ts](https://slides.com/bahmutov/ts-without-ts)

注意:
VSCode之外的编辑器可能需要更多的工作。

+++

⚠️ 在 cypress.json中配置 `ignoreTestFiles`让Cypress忽略 `d.ts` 文件，或在integration文件加之外保存".d.ts" 文件.

注意:
否则，Cypress将尝试加载".d.ts" 文件为 spec，而如果没有TypeScript加载器，会失败.

+++

## 更好的命令日志

```js
Cypress.Commands.add('createTodo', todo => {
  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
  cy.log('createTodo', todo)
})
```

+++

## 更更好的命令日志

```js
Cypress.Commands.add('createTodo', todo => {
  const cmd = Cypress.log({
    name: 'create todo',
    message: todo,
    consoleProps () {
      return {
        'Create Todo': todo
      }
    }
  })
  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
})
```

+++

![createTodo log](./img/create-todo-log.png)

+++

### 标记 命令完成

```js
cy.get('.new-todo', { log: false })
  .type(`${todo}{enter}`, { log: false })
  .then($el => {
    cmd
      .set({ $el })
      .snapshot()
      .end()
  })
```

**价值-提示:** 可以创建多个命令快照.

+++

### 在控制台中显示结果

```js
// Result将在命令结束时得到值
let result
const cmd = Cypress.log({
  consoleProps () {
    return { result }
  }
})
// custom logic then:
.then(value => {
  result = value
  cmd.end()
})
```

+++

## 第三方自定义命令

- [cypress-xpath](https://github.com/cypress-io/cypress-xpath)
- [cypress-plugin-snapshots](https://github.com/meinaart/cypress-plugin-snapshots)
- [cypress-pipe](https://github.com/NicholasBoll/cypress-pipe)

[on.cypress.io/plugins#custom-commands](https://on.cypress.io/plugins#custom-commands)

+++

## 尝试 `cypress-xpath`

```sh
# already done in this repo
npm install -D cypress-xpath
```

在 `cypress/support/index.js` 中

```js
require('cypress-xpath')
```

+++

使用 `cypress-xpath`

```js
it('finds list items', () => {
  cy.xpath('//ul[@class="todo-list"]//li')
    .should('have.length', 3)
})
```

+++

## 带有重试的自定义命令

`xpath`命令如何重试后面的断言?

```js
cy.xpath('...') // command
  .should('have.length', 3) // assertions
```

+++

```js
// use cy.verifyUpcomingAssertions
const resolveValue = () => {
  return Cypress.Promise.try(getValue).then(value => {
    return cy.verifyUpcomingAssertions(value, options, {
      onRetry: resolveValue,
    })
  })
}
```

+++

## 尝试 `cypress-pipe`

轻松重试您自己的功能

```sh
npm home cypress-pipe
```

高级样例: [https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/](https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/)

+++

### 尝试: 重试获取对象的属性

```js
const o = {}
setTimeout(() => {
  o.foo = 'bar'
}, 1000)
```

- 直到它被定义
- 并且 等于

⌨️ 测试 "passes when object gets new property"

+++

### 尝试 `cypress-plugin-snapshots`

⚠️ 安装需要3个部分: command, plugin, env 配置对象

```js
it('creates todos', () => {
  // add a few todos
  cy.window()
    .its('app.todos')
    .toMatchSnapshot()
})
```

+++

![toMatchSnapshot](./img/to-match-snapshot.png)

+++

## 尝试: 使用数据快照

- 忽略 "id" 字段, 因为它是动态的
- 如果添加了 待办事项，请更新快照

+++

## 高级概念

- 父命令 vs 子命令
- 覆盖 `cy` 命令

[on.cypress.io/custom-commands](https://on.cypress.io/custom-commands), [https://www.cypress.io/blog/2018/12/20/element-coverage/](https://www.cypress.io/blog/2018/12/20/element-coverage/)

+++
## 例子: 覆盖 `cy.type`

```js
Cypress.Commands.overwrite('type',
  (type, $el, text, options) => {

  // 添加元素到 已覆盖 列表
  rememberSelector($el)

  return type($el, text, options)
})
```

[https://www.cypress.io/blog/2018/12/20/element-coverage/](https://www.cypress.io/blog/2018/12/20/element-coverage/)

+++

![元素测试覆盖 视频](https://www.cypress.io/blog/2018/12/20/element-coverage/tested-elements.a2124117.mp4)

元素测试覆盖率视频, [https://slides.com/bahmutov/test-coverage-update](https://slides.com/bahmutov/test-coverage-update)

+++

## 最佳实践

@ul
- 创建可重用函数通常比编写自定义命令更快
- 了解Cypress API以避免编写已经可用的内容
@ulend
