## ☀️ 第5部分: 控制网络调用

### 📚 您将学习

- 如何 监视/模拟 网络调用
- 如何等待测试的网络调用
- 如何在断言中使用网络调用

+++

- 保持 `todomvc` app 运行
- 打开 `cypress/integration/05-xhr/spec.js`
- `cy.route` 已废弃, 使用 `cy.intercept`

+++

## 当前情况

- 在每个测试之前没有重置数据
- 测试通过了，但是有的测试是应该失败的

```javascript
it('starts with zero items', () => {
  cy.visit('/')
  cy.get('li.todo').should('have.length', 0)
})
```

![应该失败](./img/test-passes-but-this-is-wrong.png)

+++

## 问题点

@ul

- 页面加载
- web应用程序进行 XHR 调用 `GET /todos`
  - 同时，它显示一个空的待办事项列表
- Cypress 断言通过!
- `GET /todos` 返回2个事项
  - 它们已添加到DOM中
  - 但是测试已经结束了

@ulend

+++

## 如果等待 1 秒

```javascript
it('starts with zero items', () => {
  cy.visit('/')
  cy.wait(1000)
  cy.get('li.todo').should('have.length', 0)
})
```

![等待结果展示](./img/waiting.png)

+++

**更好的** 等待特定的XHR请求. 网络只是一个可观测的公开效果，就像DOM一样.

+++

### 尝试

在 `05-xhr/spec.js` 测试里  "starts with zero items"

@ul

- 使用`cy.intercept`监视特定 路由
  - 我们应该在`cy.visit`之前还是之后启动模拟服务?
- 保存为别名
- 等待这个XHR别名
  - 再去检查DOM

@ulend

**提示:** [`cy.intercept`]('https://on.cypress.io/intercept), [网络请求指南](https://on.cypress.io/network-requests)

+++

💡 没必要使用 `cy.wait(...).then(...)`. 所有的Cypress命令将被自动链接.

```js
cy.intercept('GET', '/todos').as('todos')
cy.visit('/')
cy.wait('@todos')
// cy.get() will run AFTER cy.wait() finishes
cy.get('li.todo').should('have.length', 0)
```

阅读 [介绍Cypress](https://on.cypress.io/introduction-to-cypress) "连续运行命令"

+++

## 尝试

添加测试 "starts with zero items":

- 像之前一样等待XHR别名
- 它的响应body应该是一个空数组

![检查响应 body](./img/response-body.png)

+++

## 模拟响应 网络调用

更新测试  "starts with zero items (stubbed response)"

- 我们不仅 监视XHR调用，还 返回一些模拟数据

```javascript
// returns an empty list
// when `GET /todos` is requested
cy.intercept('GET', '/todos', [])
```

+++

```javascript
it('starts with zero items (fixture)', () => {
  // stub `GET /todos` with fixture "empty-list"

  // visit the page
  cy.visit('/')

  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})
```
**提示:** 使用 [`cy.fixture`](https://on.cypress.io/fixture) 命令

+++

```javascript
it('loads several items from a fixture', () => {
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  // THEN visit the page
  cy.visit('/')
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
})
```

+++

### 监视添加一个事项的XHR

当你通过DOM添加一个事项时，应用程序会调用`POST` XHR.

![Post new item](./img/post-item.png)

注意:
能够使用DevTools网络选项卡来检查XHR及其请求和响应是很重要的.

+++

**尝试 1/2**

- 编写一个测试 "posts new item to the server" 这将确认新事项已被发送到服务器

![Post new item](/slides/05-xhr/img/post-item.png)

注意:
查看 `05-xhr/spec.js` 内的介绍

+++

**尝试 2/2**

- 编写一个测试  "posts new item to the server response"  确认当一个新事项被发布到服务器时响应

![Post new item response](/slides/05-xhr/img/post-item-response.png)

注意:
查看`05-xhr/spec.js` 内该测试介绍

+++

## 意外收获

网络请求指南载于[https://on.cypress.io/network-requests](https://on.cypress.io/network-requests). 问:你会监视哪些请求，你会模拟响应哪些请求?

+++

## 测试加载状态

在这个应用程序中，我们很快地展示了“加载”状态

```html
<div class="loading" v-show="loading">加载数据 ...</div>
```

+++

## 尝试

- 延迟XHR请求的加载
- 断言UI正在显示“加载数据 ”元素
- 断言“加载数据 ”元素在XHR完成后消失

⌨️ 测试 "shows loading element"

+++
## 让我们测试一下边界数据的情况

用户不能输入空白标题.如果我们的数据库有空白标题的旧数据记录怎么办?

**尝试** 编写测试 `handles todos with blank title`

+++
## 🏁 在测试中监视网络调用，并模拟网络响应

- 确认REST调用
- 模拟响应随机数据
