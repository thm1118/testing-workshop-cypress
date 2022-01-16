## ☀️ 第1部分: 基础测试

### 📚 您将学习

- `cy.contains` 和命令重试
- Cypress有两种运行方式
- 截屏和录屏

+++

- 保持`todomvc`应用程序运行
- 从根目录上 运行`npm run cy:open` 打开Cypress
- 点击  `01-basic/spec.js`

```js
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('h1', 'Todos App')
})
```

+++

`cy.contains('h1', 'Todos App')` 运行失败了  😟

注意:
现在是展示Cypress如何存储DOM快照并为每个步骤显示快照的好时机.

+++

## 提问 1/3

@ul
-  `cy.contains` 命令的 说明文档在哪里 ?
- 为什么命令执行失败 ?
  - **提示**: 使用 DevTools
- 你能解决吗 ?
@ulend

+++

## 提问 2/3

@ul
- 您看到命令重试了吗 (蓝色的转轮)?
- 使用`timeout` 选项强制命令尝试更长时间
@ulend

+++

## Cypress 运行有两个命令

- `cypress open`
- `cypress run`

+++

## 如何……?

- run 让测试  `cypress/integration/01-basic/spec.js` 在无头模式中运行?

提示: `npx cypress run --help`

+++

## 意外收获

**待办:** 使用 `cypress run`运行一个失败的测试.

- 视频录制 [https://on.cypress.io/configuration#Videos](https://on.cypress.io/configuration#Videos)
- `cy.screenshot` 命令

+++

## 修正测试

- 你能修改测试吗?
- 如何选择一个元素:
  - by text
  - by id
  - by class
  - by attributes

**提示:** https://on.cypress.io/best-practices#Selecting-Elements

+++
## 🏁 总结

- 大多数命令会重试
- 在CI模式下下 用无头模式运行Cypress `cypress run`
- 截屏和录屏

➡️ 选择 [下一节](https://github.com/cypress-io/testing-workshop-cypress#content-)
