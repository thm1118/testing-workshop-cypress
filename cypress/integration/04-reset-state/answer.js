/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  // 你可以使用单独的"beforeEach"钩子，也可以合并使用一个
  beforeEach(() => {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
  beforeEach(() => {
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
    const emptyTodos = {
      todos: []
    }
    const str = JSON.stringify(emptyTodos, null, 2) + '\n'
    // 文件路径相对于项目的根目录，根目录下有 cypress.json
    cy.writeFile('todomvc/data.json', str, 'utf8')
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
    cy.task('resetData')
    cy.visit('/')
    cy.get('li.todo').should('have.length', 0)
  })

  it('添加两个待办', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('设置初始数据', () => {
  it('即时设置数据', () => {
    cy.task('resetData', {
      todos: [
        {
          id: '123456abc',
          completed: true,
          title: 'reset data before test'
        }
      ]
    })

    cy.visit('/')
    // 检查渲染的内容
    cy.get('li.todo').should('have.length', 1)
  })

  it('使用fixture 设置数据', () => {
    cy.fixture('two-items').then((todos) => {
      // "todos" 是个数组
      cy.task('resetData', { todos })
    })

    cy.visit('/')
    // 检查渲染的内容
    cy.get('li.todo').should('have.length', 2)
  })
})
