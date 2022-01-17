## ☀️ 第13部分:应用程序行为

### 📚 您将学习

- 如何使用页面对象组织测试代码
- 如何从测试直接调用应用程序代码
- 应用程序行为的价值

+++

## 基于

- 📝 博客 [停止使用页面对象，使用应用程序操作](https://www.cypress.io/blog/2019/01/03/stop-using-page-objects-and-start-using-app-actions/)
- 💻 代码 [bahmutov/test-todomvc-using-app-actions](https://github.com/bahmutov/test-todomvc-using-app-actions)

+++

## 我们如何组织测试结构?

@ul
- 👍 Cypress 允许您编写大量的端到端测试
- 👎 Cypress 允许您编写 _大量_ 的端到端测试
@ulend

+++

## 让我们写一个页面对象

- 停止 🛑 `todomvc` app, 替换为

```sh
npm run start:react
```

完整的 React TodoMVC 实现了路由.

注意:
我们将在同一个端口上运行TodoMVC的不同实现. 因此，停止之前的应用服务，并使用上面的命令从根目录启动新的应用程序服务.

+++

- 在 `cypress/integration/13-app-actions/todo-page-object.js` 找到页面对象
- 打开 `cypress/integration/13-app-actions/using-po-spec.js`

+++

## 尝试: 编写创建待办事项的测试

使用页面对象方法

```js
beforeEach(() => {
  // visit the page
})

it('creates 3 todos', () => {
  // create default todos
  // and check that there are 3 of them
})
```

+++

```js
import { todoPage } from '../todo-page-object'

beforeEach(() => {
  todoPage.visit()
})

it('creates 3 todos', () => {
  todoPage.createTodos()
  const todos = todoPage.todos()
  todos.should('have.length', 3)
})
```

注意:
代码中的面向对象包装器和命令式风格.

+++

## 尝试: 编写切换待办状态的 测试

```js
// cypress/integration/13-app-actions/using-po-spec.js
context('toggles items', () => {
  beforeEach(() => {
    // what should you do before each test?
  })

  it('completes second item', () => {
    // toggle 1 item
    // check class names for all 3 items
  })
})
```

+++

![Toggle test](./img/toggle.png)

注意:
我们的目标是使用待办事项页面实例来创建待办事项, 然后切换其中一个的待办状态 (再次使用页面对象), 最后断言样式类的值，比如 `todoPage.todos(0).should('not.have.class', 'completed')`.

+++

```js
beforeEach(() => {
  todoPage.createTodos()
})
it('completes second item', () => {
  todoPage.toggle(1)
  todoPage.todos(0).should('not.have.class', 'completed')
  todoPage.todos(1).should('have.class', 'completed')
  todoPage.todos(2).should('not.have.class', 'completed')
})
```

+++

您可以使用类、自定义命令或简单函数来实现页面对象.

+++

## 我对使用页面对象的问题

@ul
- 遍历页面整个DOM (慢)
- 在不稳定的DOM上添加额外的代码层
- 重复在应用程序中已有的代码
@ulend

+++

```
      Tests

-----------------       tight

  Page Objects

~ ~ ~ ~ ~ ~ ~ ~ ~     very loose

    HTML UI

-----------------       tight

Application code
```

+++

## 代码开销

@ul
- 你在页面对象中用了什么方法?
- 在 `todomvc-react/js/todoModel.js` 中看到了什么方法?
@ulend

+++

```js
// app.jsx
var model = new app.TodoModel('react-todos')
if (window.Cypress) {
  window.model = model
}
```

## 尝试: 从DevTools控制台访问`model`

+++

## 尝试: 从DevTools控制台创建一个todo

切换待办状态

+++

> 💡 Cypress可以做你在DevTools控制台中可以做的任何事情

+++

## 尝试: 创建一个新测试文件 `spec.js`

- 获得 `window.model` 实例
- 调用 `addTodo` 增加几个待办

**提示:** 使用 [`cy.invoke`](https://on.cypress.io/invoke)

注意:
需要的话，查看并改进 `js/todoModel.js`中的`addTodo` 方法

+++

## 尝试: 为路由写一个测试

- 使用应用程序行为 设置初始的待办事项 `addTodo`
- 切换一两个待办的待办状态
- 检查每个视图是否显示正确数量的待办

+++

## 更多的测试

打开并运行 `cypress/integration/13-app-actions/po-full-spec.js`.里面有如下测试

- 添加待办
- 编辑
- 切换待办状态
- 路由

+++

查看 "New Todo"的一组测试. 它们都贯穿DOM

看看"Routing"这组测试 

```js
context('Routing', function () {
  beforeEach(function () {
    todoPage.createTodos()
  })
  // routing tests
})
```

+++

spec中的大多数页面对象方法的调用都是为了创建初始数据，或更改一些数据(类似 `toggle`) - 于 `todoModel.js`里面的行为一样

- 这些测试比以前快吗? 为什么?
- 这些测试是耦合到应用程序的model还是DOM?

+++

## 应用程序的行为规则

@ul
- 当测试功能 X 时- 通过UI对X进行功能测试 
- 当测试功能 Y 时- 测试使用应用行为做了 X
@ulend

注意:
测试需要涵盖所有页面特性，只是没必要每次都需要.

+++

## 主要的错误

### 在 `todomvc-react/js/todoItem.jsx` 中

注释render函数中的行

```js
onChange={this.props.onToggle}
```

哪些测试失败了?

注意:
只有将事项标记为已完成的测试才会失败,因为其余测试的是通过model来切换待办状态.

+++

## 🏁 应用程序行为 vs 页面对象

@ul
- 页面对象编写了额外的一层代码
- 应用程序行为是应用程序model的客户端
- 应用程序行为采用快捷方式进行更快的测试
@ulend

注意:
页面对象中额外的代码层是建立在非关键的DOM和事件之上的. 这些额外层对用户也没有好处，只会减慢测试速度.
