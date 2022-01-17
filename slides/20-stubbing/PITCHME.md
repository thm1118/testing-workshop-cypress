## ☀️ 模拟方法

### 📚 您将学习

- 如何进行监控活动的方法
- 如何模拟方法
- 如何在应用程序代码执行前注册模拟

---
该应用程序包括`analytics`库

```js
window.track = (eventName) => {
  console.log('tracking event "%s"', eventName)
}
window.addEventListener('load', () => {
  track('window.load')
})
```

应用程序在添加和删除待办事项时调用`track`方法

```js
track('todo.add', todo.title)
...
track('todo.remove', todo.title)
```

---
## 我们来监视那些调用

- [cy.spy](https://on.cypress.io/spy) 观察方法调用

```js
it('works on click', () => {
  cy.visit('/').then((win) => {
    // 需要一个对象和一个方法名
    cy.spy(win, 'track').as('track')
  })
  enterTodo('write code')
  cy.get('@track')
  // TODO: assert the calls
})
```

**提示:** 阅读 https://on.cypress.io/stubs-spies-and-clocks#Assertions

---
## 模拟方法调用

- 使用 [cy.stub](https://on.cypress.io/stub) 原始方法不会被打调用

```js
it('works on click', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })
  enterTodo('write code')
  cy.get('@track')
  // TODO: assert the calls
})
```

+++
## 尝试: 确认添加和删除待办事项

```js
it('tracks item delete', () => {
  // visit the page
  // stub "window.track"
  // enter and remove new todo
  // assert the stub "window.track" was called
  // with expected arguments
})
```

+++
## 尝试: 重置计数

```js
it('resets the count', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })

  enterTodo('write code')
  cy.get('@track').should('be.calledOnce')

  enterTodo('write tests')
  cy.get('@track')
    .should('be.calledTwice')
    // reset the stub?

  cy.get('@track').should('not.be.called')
  enterTodo('control the state')
  cy.get('@track').should('be.calledOnce')
})
```

---
## 如果对象改变了怎么办

```js
it('stops working if window changes', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })

  enterTodo('write code')
  cy.get('@track').should('be.calledOnce')

  cy.reload()
  enterTodo('write tests')
  // note that our stub was still called once
  // meaning the second todo was never counted
  cy.get('@track').should('be.calledOnce')
})
```

为什么 `window.track` 没有被调用两次?

+++

将调用前转到相同的模拟函数

```js
it('adds stub after reload', () => {
  // create a single stub with
  // const trackStub = cy.stub().as('track')
  // stub the window.track after cy.visit
  // and after reload
  // and then count the number of calls
})
```

---
## 在加载时，window.track 会咋样 ?

我们知道会被属性赋值`window.track = fn`, 我们需要抓住它.

```js
it('works on load', () => {
  // set up the stub when the window object exists
  // but before any code loads
  // see https://on.cypress.io/visit onBeforeLoad
  // use Object.defineProperty(win, 'track', {...}) to
  // get the "window.track = fn" assignment and call
  // the cy.stub wrapping the fn
  // after the visit command confirm the stub was called
})
```

+++
## 改进: 对每个窗口都这样做

```js
it('works via event handler', () => {
  // need to return the same stub when using cy.visit
  // and cy.reload calls that create new "window" objects
  // tip: use the cy.on('window:before:load', ...) event listener
  // which is called during cy.visit and during cy.reload
  // during the test reload the page several times, then check
  // the right number of "window.track" calls was made
})
```

确认 `window.track('load')` 使用 `cy.visit` + `cy.reload` 触发的次数

---
## 📚 另请参阅

- 阅读 Cypress "Stubs, Spies, and Clocks" 指南 [https://on.cypress.io/stubs-spies-and-clocks](https://on.cypress.io/stubs-spies-and-clocks)
- "Stubbing and spying" 配方 [https://github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes#stubbing-and-spying)

---
## 🏁 模拟方法

- 要创建间谍或模拟，您需要一个对象和方法名
- 为load 时调用的方法做准备，使用 `onBeforeLoad` 或通过 `cy.on('window:before:load', ...)`
