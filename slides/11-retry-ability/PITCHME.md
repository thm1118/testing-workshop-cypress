## ☀️ 第11部分: 重试能力

### 📚 您将学习

- 深入研究断言
- 内置命令 waits
- 重试能力 🔑
- 别名

+++

- 保持 `todomvc` app 运行
- 打开 `cypress/integration/11-retry-ability/spec.js`

+++

## 尝试:完成测试  "shows UL"

```js
it('shows list of items', function () {
  // ...
  cy.contains('ul', 'todo A')
  // confirm that the above element
  //  1. is visible
  //  2. has class "todo-list"
  //  3. css property "list-style-type" is equal "none"
})
```

+++

我写的大多数断言都是BDD

```js
cy.contains('ul', 'todo A').should('be.visible')
expect($el).to.have.prop('disabled', false)
```

[on/assertions#BDD-Assertions](https://on.cypress.io/assertions#BDD-Assertions)

+++

1, 2, or 3 个参数

```js
.should('be.visible')
.should('have.class', 'todo-list')
.should('have.css', 'list-style-type', 'none')
```

+++

## BDD有智能感知

![BDD IntelliSense](./img/assertion-intellisense.png)

+++

⚠️  Chai 智能感知不是很好

![Chai assertion IntelliSense](./img/chai-intellisense.png)

+++

如果需要，可以使用TDD断言

```js
assert.equal(3, 3, 'values are equal')
assert.isTrue(true, 'this value is true')
```

[on/assertions#TDD-Assertions](https://on.cypress.io/assertions#TDD-Assertions)

+++

## 尝试: BDD vs TDD

完成测试  "shows UL - TDD"

```js
it('shows UL - TDD', function () {
  cy.contains('ul', 'todo A').then($ul => {
    // use TDD assertions
    // $ul is visible
    // $ul has class "todo-list"
    // $ul css has "list-style-type" = "none"
  })
})
```

+++

## @fa[问题](do you see the difference?)

您喜欢哪种款式?

⚠️ [Chai-jQuery](https://on.cypress.io/assertions#Chai-jQuery) 以及 [Sinon-Chai](https://on.cypress.io/assertions#Sinon-Chai) 仅仅在 BDD 模式内.

+++

## BDD
![BDD log](./img/bdd.png)

+++

## TDD
![TDD log](./img/tdd.png)

+++

## 如果您需要更复杂的断言怎么办?

编写你自己的 [should(cb)](http://on.cypress.io/should#Function) 断言

```js
cy.get('.docs-header').find('div')
  .should(($div) => {
    expect($div).to.have.length(1)
    const className = $div[0].className
    expect(className).to.match(/heading-/)
  })
```

+++

## 尝试: 编写复杂的断言

```js
it('every item starts with todo', function () {
  // ...
  cy.get('.todo label').should($labels => {
    // confirm that there are 4 labels
    // and that each one starts with "todo-"
  })
})
```

+++

## `should(cb)` 常见用例

- 动态数据，比如有作用域的类名
- 两个单元格之间的文本是未知的，但应该相同
- 显示的值应该与API返回的值相同

[https://example.cypress.io/commands/assertions](https://example.cypress.io/commands/assertions)

+++

## 🔑 重试能力

> Cypress的关键概念，但大多数不被注意.

注意:
完成后将链接添加到重试能力页面  https://github.com/cypress-io/cypress-documentation/pull/1314
+++

### 命令和断言

```javascript
it('creates 2 items', function () {
  cy.visit('/')                       // command
  cy.focused()                        // command
    .should('have.class', 'new-todo') // assertion
  cy.get('.new-todo')                 // command
    .type('todo A{enter}')            // command
    .type('todo B{enter}')            // command
  cy.get('.todo-list li')             // command
    .should('have.length', 2)         // assertion
})
```

+++

### 看看最后一个命令+断言

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
```

命令 `cy.get()` 将被重试 ，直到断言 `should('have.length', 2)` 通过.

注意:
如果没有显示, 现在是放慢应用程序速度并展示断言如何工作的好时机, 特别是当你逐渐慢下来的时候 - 1 item, 慢1秒, 2 items - 减速2秒.

+++

命令`cy.contains` 将被重试，直到它后面的3个断言全部通过。

```js
cy.contains('ul', 'todo A')                   // command
  .should('be.visible')                       // assertion
  .and('have.class', 'todo-list')             // assertion
  .and('have.css', 'list-style-type', 'none') // assertion
```

+++

命令`cy.get`将被重试，直到5个断言都通过。

```js
cy.get('.todo label')                 // command
  .should($labels => {
    expect($labels).to.have.length(4) // assertion

    $labels.each((k, el) => {         // 4 assertions
      expect(el.textContent).to.match(/^todo /)
    })
  })
```

+++

## 重试能力

只有一些命令被重试: `cy.get`, `cy.find`, `its`. 它们不会改变应用程序的状态。

不会重试的命令有: `cy.click`, `cy.task`, 等等.

![Assertions section](./img/retry.png)

+++

## `then(cb)` vs `should(cb)`

- `should(cb)` 重试
- `then(cb)` 不会重试

### 尝试: 证明这一点

+++

##  `should(cb)`的返回值

问题:  `should(cb)` 能返回值吗?

注意:
`Should(cb)` 没有直接返回值， 它只是传递由命令生成的值. 如果你需要一个值, 首先调用 `should(cb)` 其次通过 `then(cb)` 来获得返回值.

+++

## 自动等待

![Waiting](./img/waiting.png)

大多数命令内置了断言, 即使它们不重试跟随在其后的断言. `cy.click` 如果没有按钮，则无法单击按钮, 或者它是否被禁用!

注意:
就像人类用户一样, Cypress试图做明智的事情. 您需要重试,而Cypress没有重试的命令的情况非常罕见, 即使有这种情况，你也可以自己执行, 查看 [测试什么时候可以点击?](https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/)

+++

## 超时

默认情况下，命令重试时间最长为4秒. 您可以通过设置`defaultCommandTimeout`更改全局配置.

```sh
cypress run --config defaultCommandTimeout=10000
```

⚠️ 不建议修改全局命令超时时间.

+++

## 超时

更改特定命令的超时时间

```js
// we've modified the timeout which affects
// default + added assertions
cy.get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

查看 [超时](https://on.cypress.io/introduction-to-cypress#Timeouts)

+++

> ⚠️ 只重试最后一个命令 ⚠️

+++

### 尝试: 编写检查标签的测试

![one label](./img/one-label.png)

⌨️ 测试 "has the right label"

+++

```js
it('has the right label', () => {
  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li')         // command
    .find('label')                // command
    .should('contain', 'todo A')  // assertion
})
```

+++

### 尝试: 编写检查两个标签的测试

![two labels](./img/two-labels.png)

⌨️ 测试 "has two labels"

+++

```js
it('has two labels', () => {
  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li') // command
    .find('label') // command
    .should('contain', 'todo A') // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li') // command
    .find('label') // command
    .should('contain', 'todo B') // assertion
})
```

+++

## 在应用程序中添加延迟

```js
// todomvc/app.js
addTodo ({ commit, state }) {
  // ...
  setTimeout(() => {
    axios.post('/todos', todo).then(() => {
      commit('ADD_TODO', todo)
    })
  }, 0)
},
```

> 测试现在还能通过吗?

+++

## 尝试: 调试失败的测试

- 检查失败的命令  "FIND"
- 检查之前的命令 "GET"
- 你认为发生了什么?

注意:
`FIND` 命令永远不会成功, 因为它已经锁定了只搜索第一个`<li>`元素. 所以当第二个正确的 `<li>` 元素出现时, `FIND` 仍然只搜索第一个 - 因为Cypress不会回去再重试 `cy.get`.

+++

## 尝试: 消除或缩短人为延迟使测试不稳定

> 使用二分搜索算法找到延迟，使测试变成片状测试 - 测试有时通过，有时失败。

注意:
对我来说是46毫秒. 像这样不可靠的测试在本地运行良好,然而，在网络延迟较长的情况下，生产有时会失败.

+++

> ⚠️ 只重试最后一个命令 ⚠️

```js
cy.get('.new-todo').type('todo B{enter}')
cy.get('.todo-list li') // queries immediately, finds 1 <li>
  .find('label') // retried, retried, retried with 1 <li>
  // never succeeds with only 1st <li>
  .should('contain', 'todo B')
```

我们如何修正这个不可靠的测试?

+++

## 解决方案1:合并查询

```js
// dangerous ⚠️
cy.get('.todo-list li')
  .find('label')
  .should(...)

// recommended ✅
cy.get('.todo-list li label')
  .should(...)
```

⌨️ 在测试中试试这个 "solution 1: merges queries"

注意:
测试现在应该通过了，即使有更长的延迟, 因为 `cy.get` 被重试了.

+++

## 合并查询 `cy.its`

```javascript
// 危险 ⚠️
// 只有最后一个 "its" 会被重试
cy.window()
  .its('app')             // runs once
  .its('model')           // runs once
  .its('todos')           // retried
  .should('have.length', 2)

// ✅ recommended
cy.window()
  .its('app.model.todos') // retried
  .should('have.length', 2)
```

来自 [设置标志开始测试](https://glebbahmutov.com/blog/set-flag-to-start-tests/)

+++

## 解决方案2:可选命令和断言

```js
cy.get('.new-todo').type('todo A{enter}')
cy.get('.todo-list li')         // command
  .should('have.length', 1)     // assertion
  .find('label')                // command
  .should('contain', 'todo A')  // assertion

cy.get('.new-todo').type('todo B{enter}')
cy.get('.todo-list li')         // command
  .should('have.length', 2)     // assertion
  .find('label')                // command
  .should('contain', 'todo B')  // assertion
```

⌨️ 尝试测试  "solution 2: alternate commands and assertions"

+++
## Cypress 重试:三重报头

### 1. DOM 查询

```js
cy.get('li')
  .should('have.length', 2)
```

+++
## Cypress 重试 :三重报头

### 2. 网络

```js
// spy / stub network calls
cy.route(...).as('new-item')
cy.wait('@new-item')
  .its('response.body')
  .should('have.length', 2)
```

+++
## Cypress 重试 :三重报头

### 3. 应用程序

```js
// access and spy / stub application code
cy.spy(...).as('some-method')
cy.get('@some-method')
  .should('have.been.calledOnce)
```

---
## 别名

使用 [.as](https://on.cypress.io/as) command别名保存 值和DOM元素.

请参阅本指南 [https://on.cypress.io/variables-and-aliases](https://on.cypress.io/variables-and-aliases)

+++

```js
before(() => {
  cy.wrap('some value').as('exampleValue')
})

it('works in the first test', () => {
  cy.get('@exampleValue').should('equal', 'some value')
})

// NOTE the second test is failing because the alias is reset
it('does not exist in the second test', () => {
  cy.get('@exampleValue').should('equal', 'some value')
})
```

**注意** 在每次测试之前别名会被重置

+++

![第二次测试失败，因为钩子前定义了别名](./img/alias-does-not-exist.png)

+++

**解决办法:** 在 `beforeEach` 钩子中创建别名

```js
beforeEach(() => {
  // we will create a new alias before each test
  cy.wrap('some value').as('exampleValue')
})

it('works in the first test', () => {
  cy.get('@exampleValue').should('equal', 'some value')
})

it('works in the second test', () => {
  cy.get('@exampleValue').should('equal', 'some value')
})
```

---
## 📝 拿走

大多数命令都有内置的合理等待:

> 元素应该存在并在单击之前可见

+++

## 📝 拿走

许多命令也会重试自己，直到后面的断言通过为止

```js
cy.get('li')
  .should('have.length', 2)
```

DOM 🎉 网络 🎉 应用程序方法 🎉

+++

## 📝 拿走

> ⚠️ 只会重试最后一个命令 ⚠️

1. 将查询合并到一个命令中
2. 可选命令和断言
