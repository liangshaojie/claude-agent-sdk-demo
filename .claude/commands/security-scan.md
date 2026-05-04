---
allowed-tools: Read, Grep, Glob, Bash
description: 执行安全扫描，检查代码中的安全漏洞
---

## Context

检查项目中的敏感文件：
- !`find . -name "*.env*" -o -name "*secret*" -o -name "*password*" 2>/dev/null`
- 检查 .claude/settings.json 中的 API 密钥

## Task

执行全面的安全审查：

1. **硬编码密钥检查**
   - 搜索 `api_key`, `password`, `secret`, `token`, `auth` 等关键词
   - 检查 .env 文件和环境变量配置

2. **SQL 注入风险**
   - 搜索使用字符串拼接的 SQL 查询
   - 检查是否使用参数化查询

3. **XSS 风险**
   - 检查用户输入是否正确转义
   - 搜索 `innerHTML`, `dangerouslySetInnerHTML` 等危险用法

4. **危险权限配置**
   - 检查 `bypassPermissions` 和 `allowDangerouslySkipPermissions`

5. **依赖安全**
   - 检查 package.json 中的依赖版本

## Output

生成安全审查报告，格式：
```
## 安全审查报告

### 高风险
| 问题 | 文件 | 建议 |

### 中风险
...

### 低风险
...
```