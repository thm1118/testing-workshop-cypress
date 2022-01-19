/// <reference types="cypress" />
/* eslint-disable no-unused-vars */

beforeEach(() => {
  // 应用程序应该在3000端口上运行
  // 并且在 "cypress.json"中已经设置 "baseUrl" 为 "localhost:3000"
  cy.visit('/')
})
it('加载首页', () => {
  cy.contains('h1', 'todos')
})
// 可选的 根据测试数据属性选择器辅助函数
// const tid = id => `[data-cy="${id}"]`
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  // 这里编写Cy 命令来添加新待办
}
it('添加两个待办', () => {
  addItem('first item')
  addItem('second item')
  // 填充选择器
  // 可以使用"tid" 函数
  cy.get('...').should('have.length', 2)
})
