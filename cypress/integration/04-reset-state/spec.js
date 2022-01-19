/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  beforeEach(() => {
    // application should be running at port 3000
    // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
    // TODO call /reset endpoint with POST method and object {todos: []}
    cy.visit('/')
  })

  it('添加两个待办', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('使用 cy.writeFile 重置数据', () => {
  beforeEach(() => {
    // TODO 用文化的todos 对象 写入文件 "todomvc/data.json"
    // 文件路径相对于项目的根目录，根目录下有 cypress.json
    cy.visit('/')
  })

  it('添加两个待办', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('使用一个 task 重置数据', () => {
  beforeEach(() => {
    // TODO 调用一个 task 重置数据
    cy.visit('/')
  })

  it('添加两个待办', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('设置初始数据', () => {
  it('即时设置数据', () => {
    // TODO 调用 task 传递 todos
    cy.visit('/')
    // 检查渲染的内容
  })

  it('使用fixture 设置数据', () => {
    // TODO 从文件 "cypress/fixtures/two-items.json" 加载 todos
    // 在调用task 设置 todos
    cy.visit('/')
    // 检查渲染的内容
  })
})
