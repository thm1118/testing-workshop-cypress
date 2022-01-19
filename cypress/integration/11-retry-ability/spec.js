/// <reference types="cypress" />
/* eslint-disable no-unused-vars */
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
  //  2. 有样式类 "todo-list"
  //  3. css 属性 "list-style-type" 等于 "none"
})

it('shows UL - TDD', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.contains('ul', 'todo A').then(($ul) => {
    // 使用TDD断言
    // $ul is visible
    // $ul has class "todo-list"
    // $ul css has "list-style-type" = "none"
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
  })
})

it('has the right label', () => {
  cy.get('.new-todo').type('todo A{enter}')
  // ?
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
  // ? 复制上面的检查
  // 那就把测试弄得不可靠 ...
})

it('解决办法 1: 合并查询', () => {
  cy.get('.new-todo').type('todo A{enter}')
  // ?

  cy.get('.new-todo').type('todo B{enter}')
  // ?
})

it('解决办法 2: 交替命令和断言', () => {
  cy.get('.new-todo').type('todo A{enter}')
  // ?

  cy.get('.new-todo').type('todo B{enter}')
  // ?
})

it('重试读取JSON文件', () => {
  // 通过UI添加N个待办
  // 然后读取文件 ./todomvc/data.json
  // 并断言它有N个元素，以及第一个元素就是输入的第一个待办
  // 注意 cy.readFile 会重试读取文件，直到should(cb) 通过
  // https://on.cypress.io/readilfe
})
