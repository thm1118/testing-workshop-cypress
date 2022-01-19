/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')

  // 断言通过
  // https://on.cypress.io/get
  cy.get('.new-todo').get('footer')

  // 这个断言是故意失败的
  // 你能修复吗?
  // https://on.cypress.io/get
  cy.contains('h1', 'Todos App')

  // 你可以使用正则表达式来写"cy.contains" 吗?
  // cy.contains('h1', /.../)

  // 另外一个好的实践是使用数据属性进行测试
  // 查看 https://on.cypress.io/best-practices#Selecting-Elements
  //  可以很好地与"Selector Playground" 工具协作如何选择元素
})
