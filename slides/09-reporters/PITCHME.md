## ☀️ 第9部分:报告

### 📚 您将学习

- 内置报告
- 生成多个报告
- 结合不同的报告

+++

- Cypress 内置的Mocha 的 [内置报告](https://mochajs.org/#reporters)  
- [https://on.cypress.io/reporters](https://on.cypress.io/reporters)

+++

## 尝试: 试着换一个报告

有 `json`, `list`, `markdown`, 等报告类型, 查看 [https://mochajs.org/#reporters](https://mochajs.org/#reporters)

```json
{
  "reporter": "list"
}
```

再运行 `npm test`.

注意:
每个报告 都会更改`STDOUT`的输出。

+++

## 尝试: 使用内置的`junit`报告

好处:直接输出到不同的文件

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "cypress/results/output.xml"
  }
}
```

+++

## 问题

是否所有测试结果都在保存的输出文件中?

![Run numbers](./img/test-run.png)

![Report numbers](./img/junit-output.png)

+++

## 尝试: 每个测试给出一个报告

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "cypress/results/output-[hash].xml",
    "toConsole": true
  }
}
```

注意:
选项 `reporterOptions.toConsole = true` 镜像 JUnit报告输出到 `STDOUT`.
带有`[hash]` 的文件名将根据每个spec保存单个报告. 记住在运行测试之前清理输出文件夹 `rm cypress/results/* || true && npm test`.

+++

## mocha-multi-reporters

我想输出 `spec` 到 `STDOUT` 并且同时保存  `junit` 报告. 使用 [mocha-multi-reporters](https://github.com/stanleyhlng/mocha-multi-reporters) 并安装所有依赖.

```sh
npm i -D mocha mocha-multi-reporters mocha-junit-reporter
```

```json
{
  "reporter": "mocha-multi-reporters",
  "reporterOptions": {
    "reporterEnabled": "spec, mocha-junit-reporter",
    "mochaJunitReporterReporterOptions": {
      "mochaFile": "cypress/results/output-[hash].xml"
    }
  }
}
```

+++

## Mochawesome

我们用 [Mochawesome](https://github.com/adamgruber/mochawesome) 独立的 JSON 报告, 合并它们，然后生成合并的HTML报告.

```sh
npm i -D mocha mochawesome \
  mochawesome-merge mochawesome-report-generator
```

```json
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/results",
    "overwrite": false,
    "html": false,
    "json": true
  }
}
```

注意:
这将在`cypress/results`中生成文件，类似 `mochawesome.json`, `mochawesome_001.json`, `mochawesome_002.json`. 然后我们需要将它们合并到一个JSON中.

+++

## 合并并生成HTML报告

```sh
$(npm bin)/mochawesome-merge --reportDir cypress/results > mochawesome.json
$(npm bin)/marge mochawesome.json
```

使用 [https://github.com/adamgruber/mochawesome-report-generator](https://github.com/adamgruber/mochawesome-report-generator) - aka `marge`

注意:
`$(npm bin)/marge` 是 `mochawesome-report-generator` 包的二进制别名. 能保存漂亮的报告 `mochawesome-report/mochawesome.html`.

+++

![Mochawesome report](./img/report.png)

