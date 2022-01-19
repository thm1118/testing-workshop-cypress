/// <reference types="cypress" />
it('加载', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
})

// 重要 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// 记住在运行测试之前，需要手动删除所有待办事项
// 重要 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

it('添加2个待办', () => {
  // 重复两次
  //    获得 input 字段
  //    输入文本并"回车"
  //    断言 新添加的 待办事项 被正确添加到列表中
  // cy.get(...).should('have.length', 2)
})

it('能将待办事项标记为已完成', () => {
  // 添加一些新待办
  // 将第一个待办标记为已完成
  // 确认第一个待办的样式类为 completed
  // 确认其他待办的样式类仍然 incomplete
})

it('能删除一个待办', () => {
  // 添加一些待办
  // 删除第一个待办
  // 使用 force: true 因为我们不想用鼠标悬停
  // 确认删除的待办已从dom中删除
  // 确认其他待办仍然存在
})

it('能添加许多待办', () => {
  const N = 5
  for (let k = 0; k < N; k += 1) {
    // 添加一个待办
    // 可能需要一个可重用的函数来添加待办!
  }
  // 检查待办的数量
})

it('添加随机文本的待办', () => {
  // 使用包含Math.random()的 辅助函数
  // 或者 Cypress._.random() 生成唯一的文本标签
  // 添加这些待办
  // 并确认这些待办是可见的，没有样式类 "completed"
})

it('从零个待办开始', () => {
  // 检查列表是否为空
  //   找到列表中每个TODO项的选择器
  //   使用 cy.get(...) 以及确认列表长度 应该为 0
  //   https://on.cypress.io/get
})

it('不允许添加空白待办事项', () => {
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', () => {
    // 检查 e.message 来匹配期望的错误文博
    // 如果忽略错误则返回false
  })

  // 尝试添加一个只有空格的 待办
})

// 有哪些困难?
// 更多的UI测试 http://todomvc.com/examples/vue/
