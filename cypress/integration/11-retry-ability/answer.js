/// <reference types="cypress" />
describe('retry-ability', () => {
  beforeEach(function resetData() {
    cy.request('POST', '/reset', {
      todos: []
    })
  })

  beforeEach(function visitSite() {
    cy.visit('/')
  })

  it('shows UL', function () {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.contains('ul', 'todo A')
      // 确认上述元素
      //  1. 是可见的
      .should('be.visible')
      // 2. 有样式类 "todo-list"
      .and('have.class', 'todo-list')
      // 3. css 属性 "list-style-type" 等于 "none"
      .and('have.css', 'list-style-type', 'none')
  })

  it('shows UL - TDD', function () {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.contains('ul', 'todo A').should(($ul) => {
      // 使用TDD断言
      // $ul is visible
      // $ul has class "todo-list"
      // $ul css has "list-style-type" = "none"
      assert.isTrue($ul.is(':visible'), 'ul is visible')
      assert.include($ul[0].className, 'todo-list')
      assert.isTrue($ul.hasClass('todo-list'))
      assert.equal($ul.css('list-style-type'), 'none')
    })
  })

  it('每个待办都以todo开头', function () {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.get('.todo label').should(($labels) => {
      // 确认有4个标签
      // 每一个都是以 "todo-"起始
      expect($labels).to.have.length(4)

      $labels.each((k, el) => {
        expect(el.textContent).to.match(/^todo /)
      })
    })
  })

  it('has 2 items', () => {
    cy.get('.new-todo') // command
      .type('todo A{enter}') // command
      .type('todo B{enter}') // command
    cy.get('.todo-list li') // command
      .should('have.length', 2) // assertion
  })

  it('has the right label', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo A') // assertion
  })

  // 不可靠的测试——能否通过取决于应用程序的速度
  // 要使测试不稳定，请添加超时
  // 在 todomvc/app.js "addTodo({ commit, state })" 方法
  it('有两个标签', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo B') // assertion
  })

  it('解决办法 1: 合并查询', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li label') // command
      .should('contain', 'todo B') // assertion
  })

  it('解决办法 2: 交替命令和断言', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .should('have.length', 1) // assertion
      .find('label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li') // command
      .should('have.length', 2) // assertion
      .find('label') // command
      .should('contain', 'todo B') // assertion
  })

  it('retries reading the JSON file', () => {
    // 注意 cy.readFile 会重试读取文件，直到should(cb) 通过
    // https://on.cypress.io/readfile
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.readFile('./todomvc/data.json').should((data) => {
      expect(data).to.have.property('todos')
      expect(data.todos).to.have.length(4, '4 saved items')
      expect(data.todos[0], 'first item').to.include({
        title: 'todo A',
        completed: false
      })
    })
  })
})

describe('小心 否定断言', { retries: 2 }, () => {
  beforeEach(function resetData() {
    // cy.intercept('/todos', { body: [], delayMs: 5000 })
  })

  // 这个断言可以通过—— 但却是由于错误的原因
  // 加载指示器最初不会显示，因此这一断言会快速通过
  // 当应用程序完成加载时，却可能不会通过
  it('加载中元素不可见', () => {
    cy.visit('/')
    cy.get('.loading').should('not.be.visible')
  })

  it('使用否定断言，并出于错误的原因通过', () => {
    cy.visit('/?delay=3000')
    cy.get('.loading').should('not.be.visible')
  })

  // 注意: 跳过因为它是不可靠的，放慢请求会更好
  it.skip('先使用肯定断言，然后使用否定断言(不可靠)', () => {
    cy.visit('/?delay=3000')
    // 首先，确保加载指示器显示(肯定断言)
    cy.get('.loading').should('be.visible')
    // 然后断言它应该消失 (否定断言)
    cy.get('.loading').should('not.be.visible')
  })

  it('使用 cy.route 减速网络响应', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/todos',
      response: [],
      delay: 2000
    })
    cy.visit('/?delay=3000')
    // 首先，确保加载指示器显示 (肯定断言)
    cy.get('.loading').should('be.visible')
    // 然后断言它会消失(否定断言)
    cy.get('.loading').should('not.be.visible')
  })

  it('降低网络响应速度', () => {
    cy.intercept('/todos', {
      body: [],
      delayMs: 1000
    })
    cy.visit('/?delay=1000')
    // 首先，确保加载指示器显示 (肯定断言)
    cy.get('.loading').should('be.visible')
    // 然后断言它会消失(否定断言)
    cy.get('.loading').should('not.be.visible')
  })

  it('降低网络响应速度(编程方式)', () => {
    cy.intercept('/todos', (req) => {
      req.reply({
        body: [],
        delayMs: 1000
      })
    })
    cy.visit('/?delay=1000')
    // 首先，确保加载指示器显示 (肯定断言)
    cy.get('.loading').should('be.visible')
    // 然后断言它会消失(否定断言)
    cy.get('.loading').should('not.be.visible')
  })
})

describe('别名', () => {
  context('每次测试前重置别名', () => {
    before(() => {
      cy.wrap('some value').as('exampleValue')
    })

    it('在第一个测试中有效', () => {
      cy.get('@exampleValue').should('equal', 'some value')
    })

    // 第二次测试失败，因为别名已经被重置了
    it.skip('在第二个测试中不存在别名', () => {
      // 没有别名，因为它在第一个测试之前创建一次，并在第二个测试之前重置
      cy.get('@exampleValue').should('equal', 'some value')
    })
  })

  context('应该在每次测试之前创建', () => {
    beforeEach(() => {
      // 我们将在每次测试之前创建一个新的别名
      cy.wrap('some value').as('exampleValue')
    })

    it('在第一个测试中有效', () => {
      cy.get('@exampleValue').should('equal', 'some value')
    })

    it('在第二个测试中有效', () => {
      cy.get('@exampleValue').should('equal', 'some value')
    })
  })
})
