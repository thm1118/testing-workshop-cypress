## ☀️ 第19部分: 代码覆盖率

### 📚 您将学习

- 如何收集代码覆盖信息
- 如何编写端到端测试时有效地使用代码覆盖率 🗺

+++

## ⚠️ 使用 `todomvc-redux` 应用

- 停止 TodoMVC
- 在一个终端进入 `todomvc-redux`目录，并在该目录下执行 `npm start` 

注意:
这将启动应用程序并实时检测代码

+++

打开 `localhost:3000` 并观察注入的测试代码 (the `.js` bundle). 原始代码可以通过源代码映射看到。

+++

![Instrumented code](./img/instrumented.png)

+++

跟踪所有代码行命中的代码覆盖对象是`window.__coverage__`.

注意:
解释它的结构

+++

我们将用 [@cypress/code-coverage][plugin] 插件来管理和保存 `window.__coverage__` 对象，并生成覆盖率报表.

## 尝试

- 在 `cypress/support/index.js` 中 启用 `@cypress/code-coverage` 行
- 在 `cypress/plugins/index.js` 中启用 `@cypress/code-coverage` 行

+++

## 尝试

-  `npm run cy:open` 启动cypress
- 执行测试 `cypress/integration/19-code-coverage/spec.js`
- 在浏览器中打开生成的报表 `coverage/index.html` 

+++

![Coverage report](./img/coverage.png)

+++

深入到单个文件，例如todos reducer

![Reducer coverage report](./img/reducer.png)

+++

## 尝试 1/3

- 查看来自终端的代码覆盖摘要

```shell
npx nyc report --reporter=text
npx nyc report --reporter=text-summary
```

+++

## 尝试 2/3

- 查看代码覆盖率HTML报告

```shell
open coverage/lcov-report/index.html
```

+++

## 尝试 3/3

- 添加测试以覆盖更多的源代码行

**注意:** 此应用程序没有数据持久化或服务API调用

+++

## 高级

你能通过端到端测试覆盖每一行吗? 那么边界情况呢?

+++
## 🏁 代码覆盖率

[@cypress/code-coverage][plugin] 插件用来管理 从e2e到单元测试的覆盖率信息，并生成HTML报告

+++
## 🏁 代码覆盖率

阅读Cypress代码覆盖指南 [https://on.cypress.io/code-coverage](https://on.cypress.io/code-coverage)

想法:您可以将代码覆盖信息发送到外部服务。阅读 [https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/](https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/)

[plugin]: https://github.com/cypress-io/code-coverage
