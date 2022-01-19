/// <reference types="cypress" />
//
// 注意，我们不会在每次测试前重新设置服务
// 并且我们想确认如果应用程序已经有待办，这些测试就会失败
// (例如，使用浏览器访问 localhost:3000，手动添加它们)
//

// see https://on.cypress.io/intercept

it('从零个待办开始 (等待)', () => {
  cy.visit('/')
  /* eslint-disable-next-line cypress/no-unnecessary-waiting */
  cy.wait(1000)
  cy.get('li.todo').should('have.length', 0)
})

it('从零个待办开始', () => {
  //启动 Cypress 网络服务
  // 监控路由 `GET /todos`
  // 然后再 访问该页面
  cy.intercept('GET', '/todos').as('todos')
  cy.visit('/')
  cy.wait('@todos') // 等待 `GET /todos` 响应
    // 检查服务响应
    .its('response.body')
    .should('have.length', 0)
  // 然后检查 DOM
  // 注意，我们不需要使用 "cy.wait(...).then(...)" 方式
  // 因为所有Cypress 命令都自动被扁平化连接成一条链
  // 因此只需要自然方式的 写 "cy.wait(); cy.get();"
  cy.get('li.todo').should('have.length', 0)
})

it('从零个待办开始(stubbed response)', () => {
  // 监视路由  `GET /todos`
  // 然后访问该页面
  cy.intercept('GET', '/todos', []).as('todos')
  cy.visit('/')
  cy.wait('@todos') // 等待 `GET /todos` 响应
    // 检查服务响应
    .its('response.body')
    .should('have.length', 0)
  // 然后检查DOM
  cy.get('li.todo').should('have.length', 0)
})

it('从零个待办开始 (fixture)', () => {
  // 模拟路由 `GET /todos`, 返回来自 fixture 文件的数据
  // 然后访问该页面
  cy.intercept('GET', '/todos', { fixture: 'empty-list.json' }).as('todos')
  cy.visit('/')
  cy.wait('@todos') // 等待 `GET /todos` 响应
    // 检查服务响应
    .its('response.body')
    .should('have.length', 0)
  // 然后检查DOM
  cy.get('li.todo').should('have.length', 0)
})

it('将新待办发送到服务器', () => {
  cy.intercept('POST', '/todos').as('new-item')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')
  cy.wait('@new-item').its('request.body').should('have.contain', {
    title: 'test api',
    completed: false
  })
})

it('将新待办发送到服务器', () => {
  cy.intercept('POST', '/todos').as('new-item')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')
  cy.wait('@new-item').its('response.body').should('have.contain', {
    title: 'test api',
    completed: false
  })
})

it('从一个fixture中加载若干待办', () => {
  // 模拟路由 `GET /todos` ，返回来自 fixture 文件的数据
  // 然后访问该页面
  cy.intercept('GET', '/todos', { fixture: 'two-items' })
  cy.visit('/')
  // 然后检查DOM: 有些待办应该标注 completed
  // 我们可以用多种方式来做这件事
  cy.get('li.todo').should('have.length', 2)
  cy.get('li.todo.completed').should('have.length', 1)
  cy.contains('.todo', 'first item from fixture')
    .should('not.have.class', 'completed')
    .find('.toggle')
    .should('not.be.checked')
  cy.contains('.todo.completed', 'second item from fixture')
    .find('.toggle')
    .should('be.checked')
})

it('当加载todos时处理404', () => {
  // 当应用程序试图加载待办时，
  // 设置成失败
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    {
      body: 'test does not allow it',
      statusCode: 404,
      delayMs: 2000
    }
  )
  cy.visit('/', {
    // 监视console.error，因为我们知道 应用程序会打印错误消息
    onBeforeLoad: (win) => {
      cy.spy(win.console, 'error').as('console-error')
    }
  })
  // 观察应用程序的外部效果 - console.error(...)
  cy.get('@console-error').should(
    'have.been.calledWithExactly',
    'test does not allow it'
  )
})

it('显示加载中元素', () => {
  // 将XHR的"/todos"延迟几秒钟
  // 然后用一个空列表来回应
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    {
      body: [],
      delayMs: 2000
    }
  ).as('loading')
  cy.visit('/')

  // 显示加载中元素
  cy.get('.loading').should('be.visible')

  // 等待网络调用完成
  cy.wait('@loading')

  // 现在加载中元素应该消失了
  cy.get('.loading').should('not.be.visible')
})

it('处理带有空白标题的待办事项', () => {
  cy.intercept('GET', '/todos', [
    {
      id: '123',
      title: '  ',
      completed: false
    }
  ])

  cy.visit('/')
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ')
})
