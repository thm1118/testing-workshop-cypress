## ☀️ 第8部分: Dashboard仪表盘

### 📚 您将学习

- Cypress Dashboard的目的
- 如何将测试结果发送到Cypress Dashboard
- 使用Cypress Dashboard 执行并行测试

+++

- CI 很棒，但是
  - 到处都是制品
  - 没有一致的测试视图

+++

## Cypress dashboard

![Cypress dashboard](./img/dashboard-runs.png)

+++

- 存储测试结果和视频
- 洞察每一次失败
- 并行测试执行
- GitHub集成
- 分析(正在制作)

+++

- 扩展`07-ci`文件夹中的工作
- 在交互模式下打开Cypress测试运行器
- 点击 "Runs / Set up project to record"

![Set up project to record](./img/set-up-project-to-record.png)

+++

## 记录您的测试

- 记录本地的测试运行
- 在Cypress仪表盘上查看测试结果
- 设置从CI记录的变量和命令

**提示** [https://on.cypress.io/dashboard-faq](https://on.cypress.io/dashboard-faq)

+++

## 意外收获

- 将记录key作为环境变量传递
- 故意让测试失败
- 查看仪表板上的失败的测试

+++

## 大好处:并行化

- 以1-N次的次数在N台机器上运行测试 [https://on.cypress.io/parallelization](https://on.cypress.io/parallelization)
- 📺 [Cypress parallelization webinar](https://youtu.be/FfqD1ExUGlw)

```sh
npx cypress run --record --parallel
```
