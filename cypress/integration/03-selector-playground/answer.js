/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('/')
})
it('加载首页', () => {
  cy.contains('h1', 'todos')
})
// 可选的 根据测试数据属性选择器辅助函数
const tid = (id) => `[data-cy="${id}"]`
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('[data-cy="input"]').type(`${text}{enter}`)
}

// 要启用此测试，需要添加适当的 "data-cy" 属性
it.skip('添加两个待办', () => {
  addItem('first item')
  addItem('second item')
  cy.get(tid('item')).should('have.length', 2)
})
