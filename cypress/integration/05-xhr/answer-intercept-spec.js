/// <reference types="cypress" />

import { resetDatabase, resetDatabaseTo } from '../../support/utils'
import twoItems from '../../fixtures/two-items.json'

// 这个spec 展示了当使用cy.intercept方法时，用户体验的几个“陷阱”
// 阅读 https://glebbahmutov.com/blog/cypress-intercept-problems/

describe('intercept', () => {
  context('late registration', () => {
    // 这个测试是故意跳过的.
    // 它注册拦截时，ajax已经被调用执行中
    it.skip('is registered too late', () => {
      cy.visit('/')
      cy.intercept('/todos').as('todos')
      cy.wait('@todos')
    })

    it('is registered before the call', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
    })
  })

  context('wait 后面跟随 get', () => {
    it('is taken by the wait (fixed in Cypress v6.2.0)', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      // 验证已加载的待办事项
      cy.get('@todos').should('not.be.null').and('include', {
        responseWaited: true
        // 可以验证其他已知属性
      })
    })

    it('使用弃用的 cy.route', () => {
      cy.server()
      cy.route('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('@todos').should('not.be.null')
    })

    it('应该使用等待值', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').should('include.all.keys', ['request', 'response'])
    })

    it('verifies the waited interception via .then(cb)', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').then((interception) => {
        expect(interception).to.be.an('object')
        expect(interception.request.url).to.match(/\/todos$/)
      })
    })
  })

  context('动态别名', () => {
    it('在检查请求后设置别名', () => {
      cy.intercept('*', (req) => {
        if (req.method === 'GET' && req.url.endsWith('/todos')) {
          req.alias = 'todos'
        }
      })

      cy.visit('/')
      cy.wait('@todos')
    })

    it('创建随机别名', () => {
      let alias = ''
      cy.intercept('GET', '/todos', (req) => {
        alias = 'get-todos-' + Cypress._.random(1e6)
        req.alias = alias
      })

      cy.visit('/?delay=2400')

      // first, wait for the alias string to become define
      cy.wrap('the alias string')
        .should(() => {
          expect(alias, 'alias string').to.not.be.empty
        })
        .then(() => {
          cy.wait(`@${alias}`)
        })
    })
  })

  context('已缓存的数据', () => {
    // 当DevTools打开时，这个测试可能通过，也可能不通过
    // 取决于网络面板中 "Disable cache" 的设置
    it.skip('没有响应', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').its('response').should('deep.include', {
        statusCode: 304,
        statusMessage: 'Not Modified',
        body: ''
      })
    })

    it('总是获得新数据', () => {
      cy.intercept('/todos', (req) => {
        delete req.headers['if-none-match']
      }).as('todos')
      cy.visit('/')
      cy.wait('@todos')
        .its('response')
        .should('deep.include', {
          statusCode: 200,
          statusMessage: 'OK'
        })
        .and('have.property', 'body') // yields the "response.body"
        .then((body) => {
          // since we do not know the number of items
          // just check if it is an array
          expect(body).to.be.an('array')
        })
    })
  })

  context('多个拦截', () => {
    describe('仅使用监视', () => {
      beforeEach(resetDatabase)

      beforeEach(() => {
        cy.intercept('/todos').as('todos') // spy
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post').its('request.body').should('deep.include', {
          title: 'Write a test',
          completed: false
        })
      })
    })

    describe('使用模拟和监视', () => {
      beforeEach(() => {
        cy.intercept('GET', '/todos', []).as('todos') // stub
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post').its('request.body').should('deep.include', {
          title: 'Write a test',
          completed: false
        })
      })
    })
  })

  context('常规 headers', () => {
    // 假设每个拦截在响应中都需要相同的头信息
    const headers = {
      'access-control-allow-origin': Cypress.config('baseUrl'),
      'Access-Control-Allow-Credentials': 'true'
    }

    const mergeResponse = (options = {}) => {
      return Object.assign({}, { headers }, options)
    }

    it('模拟数个请求，并有头部', () => {
      // the initial list of todo items
      cy.intercept(
        'GET',
        '/todos',
        mergeResponse({ fixture: 'two-items.json' })
      ).as('todos')
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
      cy.wait('@todos').its('response.headers').should('include', headers) // our headers are present on the response

      // let's stub posting a new item
      cy.intercept('POST', '/todos', mergeResponse({ body: {} })).as('newTodo')
      cy.get('.new-todo').type('new item{enter}')
      cy.wait('@newTodo').its('response.headers').should('include', headers) // our headers are present on the response
    })
  })

  context('没有覆盖拦截器', () => {
    describe('覆盖不起作用', () => {
      beforeEach(() => {
        cy.intercept('GET', '/todos', []) // start with zero todos
        cy.visit('/')
      })

      it('adds a todo', () => {
        cy.get('.new-todo').type('write test{enter}')
        cy.get('.todo').should('have.length', 1)
      })

      it('completes todo', () => {
        cy.get('.new-todo').type('write test{enter}')
        cy.get('.todo').should('have.length', 1).first().find('.toggle').click()
        cy.contains('.todo', 'write test').should('have.class', 'completed')
      })

      it.skip('shows the initial todos', () => {
        // hmm overwrite the intercept?
        cy.intercept('GET', '/todos', { fixture: 'two-items.json' })
        cy.visit('/')
        cy.get('.todo').should('have.length', 2)
      })
    })

    describe('分离测试和钩子', () => {
      context('start with zero todos', () => {
        beforeEach(() => {
          cy.intercept('GET', '/todos', [])
          cy.visit('/')
        })

        it('adds a todo', () => {
          cy.get('.new-todo').type('write test{enter}')
          cy.get('.todo').should('have.length', 1)
        })

        it('completes todo', () => {
          cy.get('.new-todo').type('write test{enter}')
          cy.get('.todo')
            .should('have.length', 1)
            .first()
            .find('.toggle')
            .click()
          cy.contains('.todo', 'write test').should('have.class', 'completed')
        })
      })

      context('start with two items', () => {
        it('shows the initial todos', () => {
          // hmm overwrite the intercept?
          cy.intercept('GET', '/todos', { fixture: 'two-items.json' })
          cy.visit('/')
          cy.get('.todo').should('have.length', 2)
        })
      })
    })
  })

  context('拦截器里没有Cypress 命令', () => {
    beforeEach(resetDatabase)

    it.skip('尝试使用 cy.writeFile', () => {
      cy.visit('/')
      cy.intercept('POST', '/todos', (req) => {
        console.log('POST /todo', req)
        cy.writeFile('posted.json', JSON.stringify(req.body, null, 2))
      })

      cy.get('.new-todo').type('an example{enter}')
    })

    it('之后保存', () => {
      let body

      cy.visit('/')
      cy.intercept('POST', '/todos', (req) => {
        console.log('POST /todo', req)
        body = req.body
      }).as('post')

      cy.get('.new-todo')
        .type('an example{enter}')
        .wait('@post')
        .then(() => {
          // this callback executes AFTER the "cy.wait" command above
          // thus by now the "body" variable has been set and we can
          // write the contents to the file
          cy.writeFile('posted.json', JSON.stringify(body, null, 2))
        })
    })
  })

  context('为第二个请求返回不同的数据', () => {
    it.skip('returns list with more items on page reload (does not work)', () => {
      // we start with 2 items in the list
      cy.intercept('GET', '/todos', twoItems)
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)

      // now we add the third item
      const item = {
        title: 'Third item',
        completed: false,
        id: 101
      }
      // the server replies with the posted item
      cy.intercept('POST', '/todos', item).as('post')
      cy.get('.new-todo').type(item.title + '{enter}')
      cy.wait('@post')

      // when the page reloads we expect the server to send 3 items
      const threeItems = Cypress._.cloneDeep(twoItems).concat(item)
      cy.intercept('GET', '/todos', threeItems)
      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })

    it('在页面重新加载时返回包含更多项的列表', () => {
      const item = {
        title: 'Third item',
        completed: false,
        id: 101
      }
      // we start with 2 items in the list
      // when the page reloads we expect the server to send 3 items
      const threeItems = Cypress._.cloneDeep(twoItems).concat(item)
      const replies = [twoItems, threeItems]

      // return a different response from the same intercept
      cy.intercept('GET', '/todos', (req) => req.reply(replies.shift()))
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)

      // the server replies with the posted item
      cy.intercept('POST', '/todos', item).as('post')
      cy.get('.new-todo').type(item.title + '{enter}')
      cy.wait('@post')

      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })
  })

  context('覆盖拦截器', () => {
    beforeEach(function resetIntercepts() {
      Cypress.config('intercepts', {})
    })

    Cypress.Commands.add('http', (alias, method, url, response) => {
      const key = `${alias}-${method}-${url}`
      cy.log(`HTTP ${key}`)
      const intercepts = Cypress.config('intercepts')

      if (key in intercepts) {
        intercepts[key] = response
      } else {
        intercepts[key] = response
        cy.intercept(method, url, (req) => {
          return req.reply(intercepts[key])
        }).as(alias)
      }
    })

    beforeEach(() => {
      cy.http('todos', 'GET', '/todos', [])
    })

    it('adds a todo', () => {
      cy.visit('/')
      cy.get('.new-todo').type('write test{enter}')
      cy.get('.todo').should('have.length', 1)
    })

    it('completes todo', () => {
      cy.visit('/')
      cy.get('.new-todo').type('write test{enter}')
      cy.get('.todo').should('have.length', 1).first().find('.toggle').click()
      cy.contains('.todo', 'write test').should('have.class', 'completed')
    })

    it('shows the initial todos', () => {
      // overwrite the previous response with the new one
      cy.http('todos', 'GET', '/todos', { fixture: 'two-items.json' })
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
    })

    it('adds a todo to the initial ones', () => {
      // the application starts with two items
      cy.http('todos', 'GET', '/todos', { fixture: 'two-items.json' })
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
      cy.get('.new-todo').type('third item{enter}')

      // now the server should return 3 items
      cy.http('todos', 'GET', '/todos', { fixture: 'three-items.json' })
      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })
  })

  context('单个拦截', () => {
    beforeEach(() => {
      // 将服务重置为总是有2个待办事项
      resetDatabaseTo('two-items.json')
    })

    it.skip('stubs the first load (does not work)', () => {
      // this test wants to have no todos at first
      cy.intercept('GET', '/todos', []).as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('.todo-list li').should('have.length', 0)

      cy.log('adding an item')
      cy.get('.new-todo').type('new todo{enter}')
      cy.contains('li.todo', 'new todo').should('be.visible')

      // reload and expect to see the new todo again
      cy.reload()
      cy.contains('li.todo', 'new todo').should('be.visible')
    })

    /**
     * Intercept the first matching request and send the response object.
     * Do nothing on the second and other requests.
     * @param {string} method HTTP method to intercept
     * @param {string} url URL to intercept
     * @param {any} response Response to send back on the first request
     */
    const interceptOnce = (method, url, response) => {
      // I am using "count" to show how easy you can implement
      // different responses for different interceptors
      let count = 0
      return cy.intercept(method, url, (req) => {
        count += 1
        if (count < 2) {
          req.reply(response)
        } else {
          // do nothing
        }
      })
    }

    it('第一次加载时模拟，之后不模拟', () => {
      // this test wants to have no todos at first
      interceptOnce('GET', '/todos', []).as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('.todo-list li').should('have.length', 0)

      cy.log('adding an item')
      cy.get('.new-todo').type('new todo{enter}')
      cy.contains('li.todo', 'new todo').should('be.visible')

      // reload and expect to see the new todo again
      cy.reload()
      cy.contains('li.todo', 'new todo').should('be.visible')
      // since we reset the database with 2 todos, plus entered a new todo
      // thus the total number of items should be 3
      cy.get('.todo-list li').should('have.length', 3)

      // Tip: you can still spy on "todos" intercept
      // for example let's validate the server response has the new item
      // at index 2 and it has the title and completed properties
      cy.get('@todos')
        .its('response.body')
        .should('have.length', 3)
        .its('2')
        .should('include', {
          title: 'new todo',
          completed: false
        })
    })
  })

  context('网络空闲', () => {
    beforeEach(() => {
      // let's reset the server to always have 2 todos
      resetDatabaseTo('two-items.json')
    })

    it('等待网络空闲1秒', () => {
      let lastNetworkAt
      cy.intercept('*', () => {
        lastNetworkAt = +new Date()
      })
      // 加载页面，但延迟加载数据
      cy.visit('/?delay=800')

      // wait for network to be idle for 1 second
      const started = +new Date()
      cy.wrap('网络空闲1秒').should(() => {
        const t = lastNetworkAt || started
        const elapsed = +new Date() - t
        if (elapsed < 1000) {
          throw new Error('网络繁忙')
        }
      })
      // 到现在为止，所有的东西都应该加载好了
      // 我们可以使用很短的超时来检查
      cy.get('.todo-list li', { timeout: 10 }).should('have.length', 2)
    })
  })
})
