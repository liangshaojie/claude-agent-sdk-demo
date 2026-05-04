# My Custom Plugin

这是一个 Claude 插件示例，展示了如何将 skills、agents 等组件打包成一个完整的插件。

## 💡 插件的作用

**插件 = 完整的功能包**

将相关的功能组件（skills、agents、commands、hooks、MCP servers）打包在一起，便于：

1. **📦 分发和复用**：一次打包，到处使用
2. **🔧 版本管理**：统一管理插件版本
3. **🎯 命名空间**：避免技能名称冲突

## 📁 插件结构

```text
my-custom-plugin/
├── .claude-plugin/
│   └── plugin.json       # 必需：插件清单文件
├── skills/               # 技能目录
│   ├── greeting/         # 问候技能
│   │   └── SKILL.md
│   └── task-planner/     # 任务规划技能
│       └── SKILL.md
└── agents/               # 代理目录
    └── code-reviewer.md  # 代码审查代理
```

## 🎯 包含的组件

### 技能 (Skills)

1. **greeting** - 问候技能
   - 根据时间生成个性化问候语
   - 支持多语言
   - 调用方式: `/my-custom-plugin:greeting`

2. **task-planner** - 任务规划技能
   - 将复杂目标分解为可执行任务
   - 提供优先级排序
   - 估算时间和识别依赖关系

### 代理 (Agents)

1. **code-reviewer** - 代码审查专家
   - 专注于代码质量、最佳实践、性能和安全性
   - 提供结构化的审查报告
   - 使用 Claude Sonnet 4 模型

## 🚀 使用方法

### 在 SDK 中加载插件

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import * as path from 'path';

const pluginPath = path.join(__dirname, 'my-custom-plugin');

for await (const message of query({
  prompt: '你好',
  options: {
    plugins: [
      { type: 'local', path: pluginPath }
    ]
  }
})) {
  // 处理消息
}
```

### 调用插件技能（使用命名空间）

```typescript
// 使用命名空间格式调用技能
prompt: '/my-custom-plugin:greeting 为 Alice 生成问候语'

// 或者让 Claude 自动选择合适的技能
prompt: '使用任务规划技能，帮我制定学习计划'
```

## 📋 插件清单 (plugin.json)

```json
{
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "description": "自定义插件示例 - 包含问候技能、任务规划和代码审查",
  "author": "Your Name"
}
```

## 🔑 关键要点

1. **`.claude-plugin/plugin.json` 是必需的**：这是插件的标识文件
2. **命名空间**：插件中的技能使用 `plugin-name:skill-name` 格式调用
3. **完整打包**：将相关功能打包在一起，便于管理和分发
4. **与项目配置的区别**：
   - 插件：可复用的功能包，可以分发给其他人
   - 项目配置（`.claude/`）：项目特定的配置

## 📚 参考文档

- [Agent SDK Plugins](https://code.claude.com/docs/en/agent-sdk/plugins)
- [Create Plugins](https://code.claude.com/docs/en/plugins)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
