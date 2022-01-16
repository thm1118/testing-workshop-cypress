## ☀️ 创建一个新项目

### 📚 您将学习

- Cypress 文件夹结构
- 写第一个测试
- 设置智能代码完成
- Cypress 文档

+++

## 待办: 创建一个新项目，并添加Cypress

创建一个新文件夹

- `cd /tmp`
- `mkdir example`
- `cd example`
- `npm init --yes`
- `npm install -D cypress`

+++

### 如何打开 Cypress

```
npx cypress open
$(npm bin)/cypress open
./node_modules/.bin/cypress open
```

+++

通常在 `package.json`会有

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

并使用 `npm run cy:open`

+++

![你第一次打开Cypress](./img/cypress-scaffold.png)

+++

- "cypress.json" - Cypress的所有设置
- "cypress/integration" - 测试文件结合 (specs)
- "cypress/fixtures" - 模拟数据
- "cypress/plugins" - Cypress 扩展插件
- "cypress/support" - 共享命令, 工具

注意:
本节展示Cypress如何构建它的文件和文件夹. 然后学生可以忽略这个文件夹.这只执行一次，以显示脚手架.

+++

查看搭建好的示例测试文件(specs).

运行specs，寻找看起来有兴趣的主题

提示: 可以在这里找到最新的例子 [https://github.com/cypress-io/cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink)

+++

## 💡 专业提示

```
npx @bahmutov/cly init
# 快速配置 Cypress文件夹
```

代码库 [github.com/bahmutov/cly](https://github.com/bahmutov/cly)

+++

## Cypress 示例 example kitchen sink

- 代码库 [github.com/cypress-io/cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink)
- 站点 [example.cypress.io](https://example.cypress.io)
- **提示:** 也可查看 [glebbahmutov.com/cypress-examples](https://glebbahmutov.com/cypress-examples)

+++
## 第一个测试 spec

创建一个新文件

- `cypress/integration/spec.js`

+++

在 `spec.js` 内输入

```javascript
it('loads', () => {
  cy.visit('localhost:3000')
})
```

+++

- 确保您已经在另一个终端中启动了TodoMVC，使用 `npm start`
- 在Cypress 图形界面中点击"spec.js"

+++

## 提问

- Cypress 做了什么?
- 当服务停止时会发生什么?
  - 停止在`todomvc`文件夹中运行的应用服务 
  - 重新加载测试

+++

## 切换浏览器

![切换浏览器](./img/switch-browser.png)

+++

```javascript
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
})
```

- 为什么需要 `reference types ...`?

注意:
通过使用`reference`行，我们告诉支持它的编辑器(VSCode, WebStorm)使用Cypress中包含的TypeScript定义来提供智能代码补全. 悬停在任何`cy`命令上都会带来有用的工具提示。

+++

## 智能提示

![VSCode内的智能感知](./img/cy-get-intellisense.jpeg)

+++

每一个Cypress命令和断言

![Should 命令的智能感知](./img/should-intellisense.jpeg)

+++

使用 `ts-check`

```javascript
/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  cy.visit('localhost:3000')
})
```

- 如果你添加`ts-check`行，却拼错了`cy.visit`，会发生什么?

注意:
这个检查在VSCode编辑器中工作得非常好. 我不确定其他编辑器对Cypress类型检查的支持是否很好.

+++

## 文档

你最好的朋友是 [https://docs.cypress.io/](https://docs.cypress.io/)

![文档搜索](/todomvc/img/docs-search.png)

+++

## 在 docs.cypress.io 发现

@ul
- Cypress的主要特性及其工作原理文档
- 核心概念
- 命令API
  - 有多少个命令？
@ulend

+++

## 💡 专业提示

```
https://on.cypress.io/<command>
```

直接转到该命令的文档.

+++

## 在 docs.cypress.io 发现

@ul
- 示例
  - 配方
  - 教程视频
  - 示例应用程序
  - 博客
  - FAQ
- Cypress更新日志和路线图
@ulend

注意:
学生应该知道以后在哪里可以找到信息. 主要的资源是api页面 [https://on.cypress.io/api](https://on.cypress.io/api)

+++

@snap[west]
![VSCode 图标](./img/vscode-icons.png)
@snapend

@snap[east]
意外收获: 扩展 [vscode-图标](https://github.com/vscode-icons/vscode-icons)
@snapend

+++

## 🏁 总结

- 使用智能感知
- 使用文档 [https://docs.cypress.io/](https://docs.cypress.io/)

➡️ 选择 [下一节](https://github.com/cypress-io/testing-workshop-cypress#content-)
