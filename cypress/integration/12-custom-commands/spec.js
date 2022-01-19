/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
beforeEach(function resetData() {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite() {
  cy.visit('/')
})

it('输入10个待办', function () {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
    .type('todo 3{enter}')
    .type('todo 4{enter}')
    .type('todo 5{enter}')
    .type('todo 6{enter}')
    .type('todo 7{enter}')
    .type('todo 8{enter}')
    .type('todo 9{enter}')
  cy.get('.todo').should('have.length', 10)
})

// it('creates a todo')

it.skip('当对象获得新属性时通过测试', () => {
  const o = {}
  setTimeout(() => {
    o.foo = 'bar'
  }, 1000)
  // TODO 编写 "get" ，用来返回 一个对象给定的属性
  // cy.wrap(o).pipe(get('foo'))
  // 添加断言
})

it('创建多个待办', () => {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
  cy.get('.todo').should('have.length', 3)
  cy.window().its('app.todos').toMatchSnapshot()
})
