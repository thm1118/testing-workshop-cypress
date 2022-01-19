/// <reference types="cypress" />
const isLocalHost = () => Cypress.config('baseUrl').includes('localhost')

if (isLocalHost()) {
  // 只有在本地运行时才能重置数据
  beforeEach(function resetData() {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
}

beforeEach(function visitSite() {
  cy.log('Visiting', Cypress.config('baseUrl'))
  cy.visit('/')
})

it('添加多个待办事项', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('.todo-list li') // command
    .should('have.length', 4) // assertion
})
