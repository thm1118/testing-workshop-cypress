/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
require('cypress-pipe')
import { resetData, visitSite } from '../../support/utils'

beforeEach(resetData)
beforeEach(visitSite)

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

// 简单的自定义命令
Cypress.Commands.add('createTodo', (todo) => {
  cy.get('.new-todo').type(`${todo}{enter}`)
})

// 让命令有更好的命令日志
Cypress.Commands.add('createTodo', (todo) => {
  cy.get('.new-todo', { log: false }).type(`${todo}{enter}`, { log: false })
  cy.log('createTodo', todo)
})

// 使用完整的命令日志
Cypress.Commands.add('createTodo', (todo) => {
  const cmd = Cypress.log({
    name: 'create todo',
    message: todo,
    consoleProps() {
      return {
        'Create Todo': todo
      }
    }
  })

  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
    .then(($el) => {
      cmd.set({ $el }).snapshot().end()
    })
})

it('创建一个待办', () => {
  cy.createTodo('my first todo')
})

it('当对象获得新属性时通过测试', () => {
  const o = {}
  setTimeout(() => {
    o.foo = 'bar'
  }, 1000)
  const get = (name) =>
    function getProp(from) {
      console.log('getting', from)
      return from[name]
    }

  cy.wrap(o).pipe(get('foo')).should('not.be.undefined').and('equal', 'bar')
})
