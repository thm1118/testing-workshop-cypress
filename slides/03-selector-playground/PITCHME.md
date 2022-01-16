## ☀️ 第3部分: 选择器 playground

### 📚 您将学习

- Cypress 选择器 Playground 工具
- 选择元素的最佳实践

+++

- 保持 `todomvc` app 运行
- 打开 `03-selector-playground/spec.js`

+++

> 我们如何用`cy.get(...)`选择元素 ?

- 浏览器的DevTools可以建议选择器

+++

![Chrome建议选择器](./img/chrome-copy-js-path.png)

+++

打开 "Selector Playground"

![选择器 playground 按钮](./img/selector-button.png)

+++

选择器 playground 能推荐更好的选择.

![选择器 playground](./img/selector-playground.png)

+++

⚠️ 它可以建议一个奇怪的选择器

![默认的建议](./img/default-suggestion.png)

+++

阅读 [最佳实践#选择元素](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)

![最佳实践](./img/best-practice.png)

+++

## 尝试

- 在`todomvc/index.html` DOM 标记语言中添加测试数据id
- 使用新的选择器来编写 `cypress/integration/03-selector-playground/spec.js`

注意:
更新后的测试应该类似于下一张图片e

+++

![Selectors](./img/selectors.png)

+++

## Cypress 只是 JavaScript

```js
import {selectors, tid} from './common-selectors'
it('查找元素', () => {
  cy.get(selectors.todoInput).type('something{enter}')

  // "tid" forms "data-test-id" attribute selector
  // like "[data-test-id='item']"
  cy.get(tid('item')).should('have.length', 1)
})
```

+++
## Cypress Studio

通过单击页面来记录测试

```json
{
  "experimentalStudio": true
}
```

+++
## 开始录制测试

![打开 Cypress Studio](./img/start-studio.png)

+++
## 🏁 选择元素

- 使用选择器 Playground
- 参照 [https://on.cypress.io/best-practices#Selecting-Elements](https://on.cypress.io/best-practices#Selecting-Elements)
- **额外好处:** 尝试 [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro)

+++

## 🏁 快速编写测试

- 用选择器 Playground 选取元素
-  使用 Cypress Studio 录制测试脚本

➡️ 选择 [下一节](https://github.com/cypress-io/testing-workshop-cypress#content-)
