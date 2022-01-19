/// <reference types="cypress" />
/// 重要 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// 记住在运行测试之前，需要手动删除所有待办事项
// 重要 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

beforeEach(() => {
  cy.visit('localhost:3000')
})

it('加载', () => {
  cy.contains('h1', 'todos')
})

it('添加2个待办', () => {
  cy.get('.new-todo').type('first item{enter}')
  cy.contains('li.todo', 'first item').should('be.visible')
  cy.get('.new-todo').type('second item{enter}')
  cy.contains('li.todo', 'second item').should('be.visible')
})

it('能将待办事项标记为已完成', () => {
  // 添加一些新待办
  addItem('simple')
  addItem('hard')

  // 将第一个待办标记为已完成
  cy.contains('li.todo', 'simple').should('exist').find('.toggle').check()

  // 确认第一个待办的样式类为 completed
  cy.contains('li.todo', 'simple').should('have.class', 'completed')
  // 确认其他待办的样式类仍然 incomplete
  cy.contains('li.todo', 'hard').should('not.have.class', 'completed')
})

it('能删除一个待办', () => {
  // 添加一些待办
  addItem('simple')
  addItem('hard')
  // 删除第一个待办
  cy.contains('li.todo', 'simple')
    .should('exist')
    .find('.destroy')
    // 使用 force: true 因为我们不想用鼠标悬停
    .click({ force: true })

  // 确认删除的待办已从dom中删除
  cy.contains('li.todo', 'simple').should('not.exist')
  // 确认其他待办仍然存在
  cy.contains('li.todo', 'hard').should('exist')
})

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('能添加许多待办', () => {
  // 前提：一开始没有待办事项，列表是空的

  const N = 5
  for (let k = 0; k < N; k += 1) {
    addItem(`item ${k}`)
  }
  // 检查待办的数量
  cy.get('li.todo').should('have.length', 5)
})

it('添加随机文本的待办', () => {
  const randomLabel = `Item ${Math.random().toString().slice(2, 14)}`

  addItem(randomLabel)
  cy.contains('li.todo', randomLabel)
    .should('be.visible')
    .and('not.have.class', 'completed')
})

it('从零个待办开始', () => {
  cy.get('li.todo').should('have.length', 0)
})

it('不允许添加空白待办事项', () => {
  cy.on('uncaught:exception', (e) => {
    // 如果断言失败，将会发生什么?
    // 测试会失败吗 ?
    // expect(e.message).to.include('Cannot add a blank todo')
    // return false

    // 更好的 短语句
    return !e.message.includes('Cannot add a blank todo')
  })
  addItem(' ')
})

// 有哪些困难?
// test more UI at http://todomvc.com/examples/vue/
