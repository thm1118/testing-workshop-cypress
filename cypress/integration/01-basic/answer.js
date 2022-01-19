/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  cy.visit('localhost:3000')

  // 通过断言
  // https://on.cypress.io/get
  cy.get('.new-todo').get('footer')

  // https://on.cypress.io/get
  // 使用 ("selector", "text") 参数，应用到 "cy.contains"
  cy.contains('h1', 'todos')

  // 或者可以使用正则表达式
  cy.contains('h1', /^todos$/)

  // 另外一个好的实践是使用数据属性进行测试
  // 查看 https://on.cypress.io/best-practices#Selecting-Elements
  //  可以很好地与"Selector Playground" 工具协作如何选择元素
  cy.contains('[data-cy=app-title]', 'todos')
})
