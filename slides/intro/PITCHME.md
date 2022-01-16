# Cypress 测试工作坊

- [github.com/cypress-io/testing-workshop-cypress](https://github.com/cypress-io/testing-workshop-cypress)

跳转: [00-开始](?p=00-start), [01-基础](?p=01-basic), [02-添加条目](?p=02-adding-items), [03-选择器](?p=03-selector-playground), [04-重置状态](?p=04-reset-state), [05-xhr](?p=05-xhr), [06-应用数据存储](?p=06-app-data-store), [07-ci](?p=07-ci), [08-官方仪表盘](?p=08-dashboard), [09-报表](?p=09-reporters), [10-配置](?p=10-configuration), [11-重试能力](?p=11-retry-ability)
, [12-自定义命令](?p=12-custom-commands), [13-app操作](?p=13-app-actions), [14-夹具](?p=14-fixtures), [15-调试](?p=15-debugging), [16-预处理器](?p=16-preprocessors)
, [17-组件测试](?p=17-component-testing), [18-后端](?p=18-backend), [19-代码覆盖率](?p=19-code-coverage), [20-模拟](?p=20-stubbing)
, [结尾](?p=end)

+++
## Gleb Bahmutov 博士

- Cypress 杰出工程师 
- gleb (at) cypress.io
- [@bahmutov](https://twitter.com/bahmutov)
- [https://glebbahmutov.com/blog/tags/cypress/](https://glebbahmutov.com/blog/tags/cypress/)
- [https://www.youtube.com/glebbahmutov](https://www.youtube.com/glebbahmutov)

+++

## 我们要讲的内容 1/3

时长：⏳

- 示例应用 TodoMVC
  * web app, data store, REST calls
- 页面加载基本测试
- 选择器 playground
- 重置状态
- XHR网络请求的 的 spying 和 stubbing, fixtures

+++

## 我们要讲的内容 2/3

时长：⏳

- CI 以及 Cypress 仪表盘
- 测试报告
- 配置和环境变量
- 重试能力
- debugging
- 视觉检测

+++
## 我们要讲的内容 3/3

时长：⏳

- 页面对象 vs 应用行为
- fixtures 和 后端
- 预处理器
- 组件测试
- 插件
- 代码覆盖率

+++

## Time 🕰

- 工作坊总时长 3 - 9小时, 取决于以下部分
- 短暂休息,午餐

+++

如果您有cypress 经验，请在研讨会期间帮助别人 🙏

+++

## 如何有效学习

1. 我解释并展示
2. 我们一起做
3. 你做，我帮助

+++

## 需求

您将需要:

- `git` 工具，用来clone代码库
- Node v10+ 以上以安装依赖
- Node v12 推荐

```text
git clone <repo url>
cd testing-workshop-cypress
npm install
```

+++

## 代码库的目录结构

- `/todomvc` 是我们用来测试的是web应用
- 所有测试存储在 `cypress/integration` 文件夹
  - 用来练习的子目录
    - `01-basic`
    - `02-adding-items`
    - `03-selector-playground`
    - `04-reset-state`
    - 等等
- 始终让 `todomvc` 保持运行!

注意:
当为每段课程切换测试脚本时，我们会让应用继续运行.

+++

## `todomvc`

让我们看看这个应用程序。

- `cd todomvc`
- `npm start`
- `open localhost:3000`

**重要**在整个工作坊期间中保持应用程序运行!

+++

这是一个常规的TodoMVC应用程序。

![TodoMVC](./img/todomvc.png)

+++

如果你有Vue DevTools插件

![With Vue DevTools](./img/vue-devtools.png)

+++

当使用应用程序时，查看XHR

![Network](./img/network.png)

+++

查看 `todomvc/index.html` - 主app DOM 结构

![DOM](./img/DOM.png)

+++

查看 `todomvc/app.js`

![Application](./img/app.png)

+++

## 问题

@ul
- 当你添加一个新的待办事项时会发生什么?
- 它如何到达服务器?
- 服务器将它保存在哪里?
- 启动时会发生什么?
@ulend

注意:
学生应该打开DevTools，查看web应用程序和服务器之间的XHR请求. 学生也应该发现保存项目的文件`todomvc/data.json`.

---

![Application architecture](./img/vue-vuex-rest.png)

注意:
这个应用程序已经在这篇博客文章中进行了编码和描述 [https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

+++

这个应用程序已经在这篇博客文章中进行了编码和描述 [https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

➡️ 选择 [下一节](https://github.com/cypress-io/testing-workshop-cypress#content-)
