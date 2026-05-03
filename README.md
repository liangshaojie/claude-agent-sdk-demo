# Claude Agent SDK 示例

本目录包含 Claude Agent SDK 的各种使用示例，展示了从基础查询到高级功能的不同用法。

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