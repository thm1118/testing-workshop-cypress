## ☀️ 第14部分:数据装置Fixtures

### 📚 您将学习

- 如何加载和使用数据装置

+++

- 用`npm start`启动  TodoMVC  
- 打开 `cypress/integration/14-fixtures/spec.js`

+++

## 尝试: 使用一个数据装置重置服务

⌨️ 测试 "sets list of todos on the server"

- 加载数据装置文件 "cypress/integration/two-items.json"
- 以 `{ todos: list }`提交列表到 "/reset" 

提示: 我们将需要  [`cy.fixture`](https://on.cypress.io/fixture)

+++

## 在每个测试执行前，加载数据装置

⌨️ 测试 "closure variable"

```js
let list
beforeEach(() => {
  cy.fixture('two-items')
  // then store the loaded items in variable "list"
})
it('sets list from context', () => {
  // post items to the server
})
```

+++

## 在测试上下文中存储数据

在 Mocha 中, 与 `before`, `beforeEach`这些钩子一样, `it` 能在 "this" 对象上存储数据, 如果回调函数使用 "function () { ... }" 形式.

```js
beforeEach(function () {
  this.foo = 'bar'
})
it('has foo', function () {
  expect(this.foo).to.equal('bar')
})
```

+++

## 在每个测试执行前，加载数据装置

⌨️ 测试上下文 "this.list"

```js
context('this.list', () => {
  beforeEach(function () {
    cy.fixture('two-items')
    // then assign value to "this.list"
  })
  it('sets list from context', function () {
    // POST "this.list" to the server using "/reset"
  })
  it('has valid list with 2 items', function () {
    // check that "this.list" has 2 items
  })
})
```

+++

### ⚠️ 用 `before`替换 `beforeEach` 时要小心

⌨️ 测试上下文 "this.list"

尝试用 `before`替换 `beforeEach` 来保存变量.

会发生什么? 如何解决这个问题?

注意:
每个测试都会擦除前一个上下文对象. "this.list"在第二个测试运行时变为未定义. 你可以使用闭包变量代替"this"来解决这个问题. 在试图节省登录时间时，这是一个常见问题.

+++

## 数据装置的配方

查看数据装置配方 [github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes) repository.

+++

## 仅登录一次

```js
let token
before(() => {
  cy.request(...)
    .its('response.body.token')
    .then(t => {
      // save token in closure variable
      token = t
    })
})
beforeEach(() => {
  localStorage.setItem('login-token', token)
})
// each test is logged in
```

注意:
这是加速慢速登录的常见解决方案 - 仅登录一次, 然后存储cookie和令牌，并在每次测试前设置它们.

+++

## `@ = this` 快捷方式

⌨️ 测试上下文 "@list"

```js
beforeEach(function () {
  // cy.fixture(<filename>).as(<alias name>)
  cy.fixture('two-items').as('list')
})
it('works', function () {
  // inside test use "this.list
})
```

+++

## 记住命令的队列

```js
it('does not work', function () {
  cy.fixture('two-items').as('list')
  // "this.list" 在上面的异步调用中尚未设置完成，此时立即断言会失败
  expect(this.list).to.have.length(2)
  cy.request('POST', '/reset', { todos: this.list })
})
```

注意:
测试执行是遍历每一行，按顺序执行命令

+++

## 向队列中添加命令

```js
it('works if we change the order', function () {
  cy.fixture('two-items')
    .as('list')
    .then(() => {
      // by now the fixture has been saved into "this.list"
      // check that "this.list" has 2 items
      // use it to post to the server
    })
})
```

注意:
通过 `cy.then` 调度其他回调的方式来解决问题.

+++

## 不同编码的数据装置

尝试: 在 `cypress/support/index.js` 文件中取消注释

```js
require('cypress-dark/src/halloween')
```

运行至少失败一次的测试

+++

![Halloween theme](./img/halloween.png)

测试如何加载和播放MP3?

+++

在 `node_modules/cypress-dark/halloween.js`文件中

```js
const witchLaughs = () => {
  const filename = join(getSourceFolder(), 'halloween-laugh.mp3')
  cy.readFile(filename, 'base64', { log: false }).then(mp3 => {
    const uri = 'data:audio/mp3;base64,' + mp3
    const audio = new Audio(uri)
    audio.play()
  })
}
```

+++

您也可以对fixture文件夹中的MP3文件执行同样的操作

```js
cy.fixture('audio/sound.mp3', 'base64').then((mp3) => {
  const uri = 'data:audio/mp3;base64,' + mp3
  const audio = new Audio(uri)

  audio.play()
})
```

+++

## 其他格式

```js
cy.fixture('images/logo.png').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})
cy.fixture('images/logo.png', 'binary').then((logo) => {
  // logo will be encoded as binary
  // and should look something like this:
  // 000000000000000000000000000000000000000000...
})
```

+++

## `readFile` 与 `writeFile`

`cy.readFile` 将重试，直到文件存在以及之后的断言通过

```js
// note: path is relative to the project's root
cy.readFile('some/nested/path/story.txt')
  .should('eq', 'Once upon a time...')
```

[on/readfile](https://on.cypress.io/readfile) and [on/writefile](https://on.cypress.io/writefile)

+++

## 尝试 在POST之后 `readFile`

```js
it('reads items loaded from fixture', () => {
  cy.fixture('two-items').then(todos => {
    // post items
    // read file 'todomvc/data.json',
    // should be equal to the loaded fixture
    // note: JSON is parsed automatically!
  })
})
```

+++
## 尝试 通过UI输入后 `readFile` 

```js
it('saves todo', () => {
  // reset data on the server
  // visit the page
  // type new todo via GUI
  // read file - it should have the item you have entered
})
```

+++
## 🏁 数据装置Fixtures

fixture是用于测试和网络模拟的数据对象

+++
## 🏁 数据装置Fixtures
当加载fixture时，注意 JavaScript + Mocha 生命周期和`this`上下文

+++
## 🏁 数据装置Fixtures

- [`cy.fixture`](https://on.cypress.io/fixture)
- "Fixtures" 的配方 [github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes)
