## ☀️ 第17部分: 组件测试

### 📚 您将学习

- 如何单独测试React组件

+++
## 组件测试

* [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test)
* [cypress-vue-unit-test](https://github.com/bahmutov/cypress-vue-unit-test)
* [cypress-cycle-unit-test](https://github.com/bahmutov/cypress-cycle-unit-test)
* [cypress-svelte-unit-test](https://github.com/bahmutov/cypress-svelte-unit-test)
* [cypress-angular-unit-test](https://github.com/bahmutov/cypress-angular-unit-test)
* [cypress-hyperapp-unit-test](https://github.com/bahmutov/cypress-hyperapp-unit-test)
* [cypress-angularjs-unit-test](https://github.com/bahmutov/cypress-angularjs-unit-test)

[on.cypress.io/plugins#component-testing](http://on.cypress.io/plugins#component-testing)

+++
## 💡 理解

创建一个空页面并挂载组件X，而不是加载一个HTML页面
+++

```jsx
import React from 'react'
const HelloWorld = () => <p>Hello World!</p>
describe('HelloWorld component', () => {
  it('works', () => {
    cy.mount(<HelloWorld />)
    cy.contains('Hello World!')
  })
})
```

**⚠️ 注意:** 组件测试API可能会改变

+++

![Hello World component test](./img/hello-world.png)

+++
## 第一个组件测试

- **停止** TodoMVC 应用
- 打开 `cypress/integration/17-component-testing/footer-spec.js`

+++

```js
/// <reference types="cypress" />
import React from 'react'
import Footer from './Footer'
// adds custom command "cy.mount"
import 'cypress-react-unit-test'
import { filters } from './filters'
```
注意我们是如何直接从spec文件中加载React组件和应用程序代码的

+++

## 尝试: 第一个组件测试

⌨️ 测试 "shows Footer"

- 挂载组件
- 连接 "all" 应该有 selected 样式

+++

![Footer component test](./img/footer-component-test.png)

+++

## 尝试: 测试单击

⌨️ 测试 "clears completed on click"

- 挂载组件
- 传递模拟给 "onClearCompleted" prop
- 检查 "clear completed" 按钮是否可视，并单击

+++
![on click test](./img/on-click.png)

+++
## 组件测试vs E2E

- 组件就像微型web应用程序

+++
## 单元测试 vs E2E

### 单元测试

- 聚焦代码
- 短
- 黑盒

+++
## 单元测试 vs E2E

### 端到端测试

- 聚焦于功能
- 长
- 外部效果

+++
## 单元测试 和 E2E

- 聚焦于一件事
- 给你信心
- 在本地和CI上运行

+++
## 🏁 组件测试

@ul
你不是访问一个页面，而是挂载一个组件。
然后您将以与完整的端到端测试相同的方式进行测试。
@ulend

+++
## 🏁 组件测试:更多信息

- [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test)
- [on.cypress.io/plugins#component-testing](https://on.cypress.io/plugins#component-testing)
- [github.com/bahmutov/calculator](https://github.com/bahmutov/calculator)
- 博客 [Sliding Down the Testing Pyramid](https://www.cypress.io/blog/2018/04/02/sliding-down-the-testing-pyramid/)
