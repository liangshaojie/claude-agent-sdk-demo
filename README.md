# Claude Agent SDK 示例

本目录包含 Claude Agent SDK 的各种使用示例，展示了从基础查询到高级功能的不同用法。

注意：需要配置.cladue/settings.json 文件

## 示例列表

### 01-basic-agent.ts

**基础 Agent 查询**

最基本的 Agent 查询示例，演示如何流式获取 Claude 的响应和处理工具调用结果。

```bash
npx tsx 01-basic-agent.ts
```

---

### 02-project-query.ts

**项目信息查询**

使用 Agent 查询项目中配置的信息，如已安装的 skills 列表。展示如何限制可使用的工具集合。

```bash
npx tsx 02-project-query.ts
```

---

### 03-session-continue.ts

**会话继续**

演示如何基于之前的会话继续对话，使用 `continue: true` 选项让 Agent 记住上下文。

```bash
npx tsx 03-session-continue.ts
```

---

### 04-multi-turn-conversation.ts

**多轮对话**

展示完整的多轮对话流程，包括：

- 询问项目结构
- 继续询问具体文件
- 深入查看文件内容

每轮对话使用 `continue: true` 保持会话连贯性。

```bash
npx tsx 04-multi-turn-conversation.ts
```

---

### 05-stream-conversation.ts

**流式对话生成器**

使用异步生成器（AsyncGenerator）实现流式对话，可以：

- 发送多条消息
- 支持图片上传（base64）
- 模拟用户思考间隔

```bash
npx tsx 05-stream-conversation.ts
```

---

### 06-permission-interceptor.ts

**权限拦截器**

演示如何使用 `canUseTool` 回调拦截 Agent 的工具调用，自定义处理 `AskUserQuestion` 等交互式工具。

```bash
npx tsx 06-permission-interceptor.ts
```

---

### 07-json-output.ts

**JSON Schema 结构化输出**

使用 `outputFormat` 配置返回 JSON Schema 格式的结构化数据。展示如何定义期望的数据结构并获取验证后的结果。

```bash
npx tsx 07-json-output.ts
```

---

### 08-json-zod.ts

**Zod Schema 结构化输出**

使用 Zod 库定义输出 Schema，并将 Zod Schema 转换为 JSON Schema。展示类型安全的结构化输出方法。

```bash
npx tsx 08-json-zod.ts
```

---

### 09-struct-output.ts

**中文提示词的结构化输出**

使用中文提示词配合 Zod Schema 获取结构化的 JSON 输出。演示如何确保模型输出符合预期格式。

```bash
npx tsx 09-struct-output.ts
```

---

### 10-todo-extraction.ts

**TODO 注释提取**

使用 Agent 的工具能力（Grep）搜索代码库中的 TODO 注释，并通过 git blame 获取添加者信息。展示如何利用 Agent 工具执行实际任务。

```bash
npx tsx 10-todo-extraction.ts
```

---

### 11-custom-mcp-tools.ts

**自定义 MCP 工具**

演示如何：

- 使用 `tool()` 定义自定义工具
- 使用 `createSdkMcpServer()` 创建 MCP 服务器
- 通过 `mcpServers` 选项将工具注册到 Agent
- 使用 `permissionMode: 'bypassPermissions'` 自动授权工具调用

示例包含两个工具：`get_weather`（天气查询）和 `calculate`（数学计算）。

```bash
npx tsx 11-custom-mcp-tools.ts
```

---

### 12-multiple-mcp-tools.ts

**多个自定义工具与错误处理**

演示如何：

- 在一个 MCP 服务器中定义多个工具
- 使用 `toolCallLog` 记录工具调用日志
- 处理错误情况（空数组、无效操作等）

包含三个工具：

- `string_operations`：字符串处理（大小写、反转、长度）
- `array_operations`：数组操作（求和、平均值、最大值、最小值、排序）
- `random_choice`：随机选择

```bash
npx tsx 12-multiple-mcp-tools.ts
```

---

### 13-http-mcp-server.ts

**HTTP MCP 服务器**

演示如何：

- 配置 HTTP 传输的远程 MCP 服务器
- 使用 `allowedTools` 限制可用的工具
- 使用 `permissionMode: 'bypassPermissions'` 自动授权

```bash
npx tsx 13-http-mcp-server.ts
```

---

### 14-github-mcp-server.ts

**GitHub MCP 服务器**

演示如何：

- 使用 GitHub 官方 MCP 服务器 (`@modelcontextprotocol/server-github`)
- 通过环境变量 `GITHUB_TOKEN` 配置认证
- 调用 `list_issues` 工具查询仓库 Issues

需要设置 GitHub Personal Access Token：

```bash
export GITHUB_TOKEN=your_github_token_here
npx tsx 14-github-mcp-server.ts
```

```bash
npx tsx 14-github-mcp-server.ts
```

---

### 15-query-examples.ts

**子代理(Subagent)调用示例**

展示如何使用 `agents` 配置进行多代理协作。主要功能：

- 定义多个专用子代理（安全审计、代码审查、测试执行等）
- 使用 `description` 描述代理职责，让 Claude 智能分配任务
- 使用 `prompt` 定义子代理行为和专业知识
- 使用 `tools` 限制子代理可使用的工具
- 使用 `model` 为不同子代理选择不同模型（haiku/sonnet/opus）

包含 15 个示例场景：

1. 基础单代理查询
2. 代码审查流程（安全+质量双代理）
3. 不同模型权衡（haiku 快速 vs opus 深度）
4. 只读代理分析
5. 测试执行代理（Bash 访问）
6. 文档生成流水线
7. 性能优化流水线
8. 调试专家系统
9. 重构规划专家
10. 安全扫描流水线
11. 架构评审委员会（3 代理）
12. TypeScript 迁移助手
13. 需求分析团队
14. CI/CD 质量门禁（3 代理）
15. 学习辅导助手（3 代理）

```bash
npx tsx 15-query-examples.ts
```

---

### 16-slash-commands.ts

**Slash Commands（斜杠命令）示例**

展示如何在 SDK 中配置和使用自定义 slash commands。主要功能：

- 定义 slash command 的名称、描述和触发行为
- 在 `slashCommands` 选项中注册自定义命令
- 使用 `disableDefaultSlashCommands` 禁用内置命令
- 在 prompt 中通过 `/command-name` 格式触发命令

包含 4 个子示例：

1. 基础 slash command 配置
2. 按顺序执行多个命令
3. 带参数的命令
4. 禁用内置命令

```bash
npx tsx 16-slash-commands.ts
```

---

### 17-skills-example.ts

**Skills（技能）系统示例**

展示如何使用 Agent Skills 扩展 Claude 的专业能力。包含 8 个示例：基础使用、PDF 处理、数据分析、代码重构、多 Skill 协作、与子代理结合、发现测试、权限控制。

项目包含三个示例 Skills：

- `.claude/skills/pdf-processor/` - PDF 文档处理
- `.claude/skills/data-analyzer/` - 数据分析
- `.claude/skills/code-refactor/` - 代码重构

```bash
npx tsx 17-skills-example.ts
```

---

### 18-plugins-example.ts

**Plugin（插件）系统**

演示插件的概念和使用方式。

**💡 插件的作用**：

将 skills、agents、commands、hooks 等**打包成一个完整的包**，便于：

- 📦 **分发和复用**：一次打包，到处使用
- 🔧 **版本管理**：统一管理插件版本
- 🎯 **命名空间**：避免技能名称冲突（如 `/plugin-name:skill-name`）

**插件结构示例：**

```text
my-custom-plugin/
├── .claude-plugin/
│   └── plugin.json       # 必需：插件清单
├── skills/               # 技能
│   ├── greeting/
│   │   └── SKILL.md
│   └── task-planner/
│       └── SKILL.md
└── agents/               # 代理
    └── code-reviewer.md
```

**使用方式：**

```typescript
// 加载插件包
options: {
  plugins: [{ type: "local", path: "./my-custom-plugin" }];
}

// 调用插件技能（使用命名空间）
prompt: "/my-custom-plugin:greeting 生成问候语";
```

**包含 6 个示例**：加载插件包、使用插件技能、任务规划、多插件加载、插件与项目配置结合、验证插件结构。

```bash
npx tsx 18-plugins-example.ts
```

**注意**：SDK 的插件加载机制可能与 Claude Code IDE 有所不同，本示例展示了插件的标准结构和使用方式。

---

## 运行所有示例

```bash
# 运行单个示例
npx tsx 01-basic-agent.ts

# 或使用 ts-node
ts-node 01-basic-agent.ts
```

## 依赖

- `@anthropic-ai/claude-agent-sdk` - Claude Agent SDK
- `zod` - 用于定义类型安全的 Schema

安装依赖：

```bash
npm install
```
