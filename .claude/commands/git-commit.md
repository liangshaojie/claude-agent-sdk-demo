---
allowed-tools: Bash(git status *), Bash(git diff *), Bash(git add *), Bash(git commit *)
description: 智能生成 git commit 信息并执行提交
---

## Context

当前代码状态：
- !`git status`

当前变更：
- !`git diff HEAD`

## Task

1. 分析当前的代码变更
2. 根据变更内容生成合适的 commit 信息：
   - 使用中文编写
   - 遵循 Conventional Commits 规范
   - 格式：
     ```
     <type>: <简短描述>

     <详细说明（可选）>
     ```
   - type 可选值：feat, fix, docs, style, refactor, test, chore

3. 显示生成的 commit 信息供确认

4. 如果变更内容较少，可以直接提交
   - 执行 git add * 和 git commit

5. 如果有未跟踪的文件，提示用户

## Output

```
生成的 commit 信息：
<type>: <描述>

详细说明

是否提交？(y/n)
```

提交成功后显示：
```
✅ 提交成功: <commit hash>
```