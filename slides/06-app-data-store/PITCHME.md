## ☀️ 第6部分: 应用程序数据存储

### 📚 您将学习

- 如何从测试代码访问正在运行的应用程序
- 如何在应用程序中模拟一个方法
- 如何通过分派操作驱动应用程序

+++

- 保持 `todomvc` app 运行
- 打开 `cypress/integration/06-app-data-store/spec.js`
- 测试 Vuex data store 正确工作

+++

## 应用程序对象

```javascript
// 如果仅仅在端到端测试中暴露  "app" 全局访问，可以使用 "window.Cypress"作为条件
if (window.Cypress) {
   window.app = app
}
```

+++

## 尝试: check Vuex state

```javascript
it('adds items to store', () => {
  addItem('something')
  addItem('something else')
  // get application's window
  // then get app, $store, state, todos
  // it should have 2 items
})
```

+++

![Random id](./img/new-todo.png)

+++

## 不确定性

- 测试中的随机数据使测试变得非常困难
- 比如 UUIDs, dates
- Cypress 包括XHR和方法模拟 使用 [http://sinonjs.org/](http://sinonjs.org/)
- [https://on.cypress.io/stubs-spies-and-clocks](https://on.cypress.io/stubs-spies-and-clocks)

+++

## 问题

- 一个新事项如何获得它的id?
- 你能覆盖DevTools中的随机id生成器吗?

+++

## Iframed contexts

![Contexts](./img/contexts.png)

+++

## 测试中的应用程序

![Application under test](./img/app-in-window.png)

+++

## 模拟 应用的随机生成器

- 在 `06-app-data-store/spec.js`的测试 "creates an item with id 1" 
- 使用 `cy.window`获取应用程序的上下文；
- 获得应用的 `window.Math` 对象
- 你能模拟应用程序的随机生成器吗?
  - **提示 ** 使用 `cy.stub`

+++

## 监视 确认行为

- 测试 "creates an item with id using a stub"
- 编写一个添加1项的测试
- 用别名命名监视 `cy.spy(...).as('name')`
- 找到那个用别名的监视器，确认他被调用了一次

+++

## 应用数据存储

- 在DevTools的窗口中检查'window.app' 变量
- 您能否在数据存储中找到添加的事项 ?
  - **提示** 你可能需要'JSON.parse(JSON.stringify(...))' 来获得一个 "simple"对象

注意:
我们的目标是表明，任何可以通过DevTools完成的工作都可以在端到端测试中通过 通过使用`cy.window` 进入应用程序来完成. 应用程序代码甚至可以在测试期间使用 `if (window.Cypress) ...`这样的条件.

+++

## 尝试

编写一个测试:

- 添加2个 事项
- 获取数据存储
- 对数据存储中的对象进行确认

+++

## 高级

编写一个测试:

- 将操作分派到存储以添加项
- 确认新的事项被添加到DOM中

(看到下一张幻灯片)
+++

```js
it('adds todos via app', () => {
  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  // using https://on.cypress.io/invoke
  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  // and then check the UI
})
```

+++
## 尝试: 测试边界数据

```js
it('handles todos with blank title', () => {
  // 添加用户不能通过UI添加的 空白数据
  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'setNewTodo', '  ')
  // app.$store.dispatch('addTodo')
  // confirm the UI
})
```

+++

### ⚠️ 注意陈旧的数据

请注意，web应用程序可能没有立即更新数据。例如:

```js
getStore().then(store => {
  store.dispatch('setNewTodo', 'a new todo')
  store.dispatch('addTodo')
  store.dispatch('clearNewTodo')
})
// 不一定马上就有新事项
getStore().its('state')
```

注意:
在一个不可靠的测试中 https://github.com/cypress-io/cypress-example-recipes/issues/246 以上代码调用 `getStore().its('state').snapshot()` 在更新待办事项列表的前后都被调用了几次.

+++

### ⚠️ 注意陈旧的数据

**解决办法:** 使用前请确认数据已准备就绪.

```js
// add new todo using dispatch
// retry until new item is in the list
getStore()
  .its('state.todos')
  .should('have.length', 1)
// do other checks
```

+++
## 🏁 应用程序访问

- 当需要时，您可以直接从测试中访问应用程序

同时参阅: https://www.cypress.io/blog/2018/11/14/testing-redux-store/
