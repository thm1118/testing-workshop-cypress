/// <reference types="cypress" />
//
// 注意，我们不会在每次测试前重新设置服务
// 并且我们想确认如果应用程序已经有待办，这些测试就会失败
// (例如，使用浏览器访问 localhost:3000，手动添加它们)
//
// see https://on.cypress.io/intercept

/* eslint-disable no-unused-vars */

it('从零个待办开始 (等待)', () => {
  cy.visit('/')
  // 等待1秒
  // 然后检查待办的数量
  cy.get('li.todo').should('have.length', 0)
})

it('从零个待办开始', () => {
  // 启动 Cypress 网络服务
  //  使用 cy.intercept(...).as(<alias name>) 监控路由 `GET /todos`
  // 然后再 访问该页面
  cy.visit('/')
  //  通过 "@<alias name>" 别名字符串 等待 路由 `GET /todos`
  // 然后检查 DOM
  cy.get('li.todo').should('have.length', 0)
})

it('从零个待办开始 (模拟响应response)', () => {
  // 模拟 `GET /todos` 响应为空数组 []
  // 并保存为一个 别名

  // 然后访问该页面
  cy.visit('/')

  // 等待路由别名获取其响应body
  // 确保body是一个空列表
})

it('从零个待办开始 (fixture)', () => {
  // 模拟 `GET /todos` ，通过 fixture "empty-list"

  // 访问该页面
  cy.visit('/')

  // 然后检查DOM
  cy.get('li.todo').should('have.length', 0)
})

it('从一个fixture中加载若干待办', () => {
  // 模拟 `GET /todos` ，使用来自 fixture 文件 "two-items.json" 的数据
  // 然后访问该页面
  cy.visit('/')
  // 然后检查DOM:一些待办应该被标记为完成
  // 我们可以用多种方式来做这件事
})

it('将新待办发送到服务器', () => {
  // 监视 "POST /todos", 保存为别名
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')

  // 使用别名等待XHR调用, 获取其请求或响应body
  // 确定它包含 {title: 'test api', completed: false}
  // 提示: use cy.wait(...).its(...).should('have.contain', ...)
})

it('', () => {
  // 当应用程序试图加载待办时，
  // 将GET /todos设置为失败，延时2秒后返回404
  cy.visit('/', {
    // 监视console.error，因为我们知道 应用程序会打印错误消息
    onBeforeLoad: (win) => {
      // spy
    }
  })
  // 观察应用程序的外部效果 - console.error(...)
  // cy.get('@console-error')
  //   .should(...)
})

it('显示加载中元素', () => {
  // 将XHR的"/todos"延迟几秒钟
  // 然后用一个空列表来回应
  // 显示加载中元素
  // 等待网络调用完成
  // 现在加载中元素应该消失了
})

it('处理带有空白标题的待办事项', () => {
  // 返回只有一个待办的的todo列表
  // 这个待办的标题为空或null
  // 确认这个待办正确显示
})

it('waits for network to be idle for 1 second', () => {
  // 拦截所有请求
  // 在每次截获中设置时间戳
  // 重试使用 should(cb)检查 自有网络时间戳以来，已经过去的时间
})
