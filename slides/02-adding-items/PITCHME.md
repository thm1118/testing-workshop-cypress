## ☀️ 第2部分: 添加待办事项测试

### 📚 您将学习

- 操作元素的常用命令
- 使用Mocha钩子组织测试代码

+++

## 什么样的测试?

- 讨论: 你会在TodoMVC应用程序中测试什么?

注意:
较长的测试，例如添加项然后删除项. 通过GUI添加事项并观察与服务器的通信. 添加事项，然后重新加载页面.

+++

- 让 `todomvc` 持续运行
- 在IDE中打开 `cypress/integration/02-adding-items/spec.js` 
- 在Cypress中点击 `02-adding-items/spec.js` 

+++

## ⚠️ 代码事项

**注意:** 我们将要编写的测试没有重置之前添加的Todo项. 手动删除每次测试前的Todo项.

我们将在“4 重置状态”章节中重置之前保存的Todo项。.

+++

```js
it.only('添加两个待办事项', () => {
  // 重复两次
  //    获取 input 字段
  //    键入文本"回车"
  //    断言在列表中 确实增加了 新的 Todo 事项
})
```

**提示** 使用 `cy.get`, `cy.type`, `cy.contains`, `cy.click`, 记住 `https://on.cypress.io/<command>`

注意:
区分命令和断言, 显示命令是如何链接的,
每一个都继续使用前一个命令的目标subject. 断言不会改变subject.

+++

## 待办:标记第一项已完成

```js
it('能够标记事项为已完成', () => {
  // 添加新事项
  // 标记第一个事项为已完成
  // 确认第一项具有预期的completed 样式类
  // 确认其他项目仍然是 incomplete
})
```
+++

## 重构代码 1/3

- 在每次测试前访问该页面

注意:
避免在每个测试的开始重复`cy.visit('localhost:3000')` 命令，.

+++

## 重构代码 2/3

- 将url移动到 `cypress.json`

**提示** 看看 [https://on.cypress.io/configuration](https://on.cypress.io/configuration)

+++

## 重构代码 3/3

- 创建一个辅助函数来添加待办事项项

**提示** 这只是 JavaScript

注意:
将`addItem`函数移到一个单独的文件中，并在spec文件中导入. 它只是JavaScript，并且Cypress捆绑了每个spec文件，所以实用程序可以有`cy…`的命令!

+++

## 尝试: 删除一个事项

```javascript
it('能够删除一个事项', () => {
  // 添加一些事项
  // 删除第一个事项
  // 使用 force: true 因为我们不想悬停确认删除的项已经从dom中删除，确认另一个项仍然存在
})
```
+++

## 尝试

```javascript
it('添加带有随机文本的事项', () => {
  // 通过 Math.random()或Cypress._.random() 生成事项的唯一的文本标签，包装成辅助函数
  // 添加这些事项
  // 并确保这些事项是可见的，没有样式类 "completed"
})
```

+++

## 💡 专业提示

- 在`cypress.json`中调整视窗的大小 
- 在`cypress.json`中设置 智能感知[https://on.cypress.io/intelligent-code-completion](https://on.cypress.io/intelligent-code-completion)

+++
## 添加空白事项

应用程序不允许添加带有空白标题的事项. 当用户这样做时会发生什么? 提示:打开DevTools控制台.

### 尝试

填写测试 `不允许添加空白事项`.

+++
## 意外收获

单元测试 vs 端到端测试

### 单元测试

```javascript
import add from './add'
test('add', () => {
  expect(add(2, 3)).toBe(5)
})
```

- arrange - action - assertion
- 配置前提 - 执行 - 断言

+++

### 端到端测试

```javascript
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}
it('能否将事项标记为已完成', () => {
  const ITEM_SELECTOR = 'li.todo'
  addItem('simple')
  addItem('difficult')
  cy.contains(ITEM_SELECTOR, 'simple').should('exist')
    .find('input[type="checkbox"]').check()
  // 必须强制点击，因为按钮只会在鼠标悬停时显示；
  cy.contains(ITEM_SELECTOR, 'simple').find('.destroy').click({ force: true })
  cy.contains(ITEM_SELECTOR, 'simple').should('not.exist')
  cy.get(ITEM_SELECTOR).should('have.length', 1)
  cy.contains(ITEM_SELECTOR, 'difficult').should('be.visible')
})
```

- **提示** 查看 `cy.pause` 命令

注意:
再次讨论应该编写什么样的测试. 端到端测试可以在一个测试中涵盖很多特性, 这是推荐的做法. 如果测试失败，很容易调试它，并查看应用程序在每个步骤中的样子.

+++

### 单测 vs E2E

- 如果你正在描述代码如何工作:单元测试
- 如果您正在描述用户如何使用代码:端到端测试

+++

### 意外收获

- 核心概念 [https://on.cypress.io/writing-and-organizing-tests](https://on.cypress.io/writing-and-organizing-tests)

+++

使用文件夹结构和规范文件组织测试

```text
cypress/integration/
  featureA/
    first-spec.js
    second-spec.js
  featureB/
    another-spec.js
    errors-spec.js
```

+++

一个spec文件中，使用Mocha函数在组织每个测试

```js
describe('Feature A', () => {
  beforeEach(() => {})

  it('works', () => {})

  it('handles error', () => {})

  // context is alias of describe
  context('in special case', () => {
    it('starts correctly', () => {})

    it('works', () => {})
  })
})
```

+++
## 🏁 像用户一样编写测试

- 通过用户界面
- 在操作之后验证应用程序

➡️ 选择 [下一节](https://github.com/cypress-io/testing-workshop-cypress#content-)
