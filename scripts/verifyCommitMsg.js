const chalk = require('chalk');  // eslint-disable-line
const msgPath = process.env.GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

// 检测 commit 注释内容结构，对后续 changelog 有重要作用
const COMMIT_REG = /^(v\d+\.\d+\.\d+(-(alpha|beta|rc.\d+))?$)|((revert:\s*)?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?:\s*.{1,50})/;

/*
  A类：
  --------------------------------------------------
  version   新版本，如 v1.0.0、v1.0.0-beta、v1.0.1-rc

  B类：
  --------------------------------------------------
  feat      新功能
  fix       修复 Bug
  docs      文档更新
  style     代码的格式，标点符号的更新
  refactor  代码重构
  perf      性能优化
  test      测试更新
  build     构建系统或者包依赖更新
  ci        配置，脚本文件等更新
  chore     非 src 或者 测试文件的更新
  revert    回退 commit
 */

if (!COMMIT_REG.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.red.bold('ERROR ')} ${chalk.red(`invalid commit message format.`)}\n` +
    chalk.red(`  Proper commit message format is required for automated changelog generation. \n\n`) +
    chalk.blue(`  Examples:\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
    chalk.blue(`  The available formats are as follows:\n`) +
    `    ${chalk.green(`feat:     A new feature`)}\n` +
    `    ${chalk.green(`fix:      A bug fix`)}\n` +
    `    ${chalk.green(`docs:     Documentation only changes`)}\n` +
    `    ${chalk.green(`style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)`)}\n` +
    `    ${chalk.green(`refactor: A code change that neither fixes a bug nor adds a feature`)}\n` +
    `    ${chalk.green(`perf:     A code change that improves performance`)}\n` +
    `    ${chalk.green(`test:     Adding missing tests or correcting existing tests`)}\n` +
    `    ${chalk.green(`build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)`)}\n` +
    `    ${chalk.green(`ci:       Changes to our CI configuration files and scripts (example scopes: Trav is, Circle, BrowserStack, SauceLabs)`)}\n` +
    `    ${chalk.green(`chore:    Other changes that don't modify src or test files`)}\n` +
    `    ${chalk.green(`revert:   Reverts a previous commit`)}\n`
  );
  process.exit(1);
}
