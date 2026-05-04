/**
 * Claude Agent SDK 示例15 - 子代理(Subagent)调用
 * 展示如何在 query 中使用 agents 配置进行多代理协作
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================
// 子代理调用示例
// ============================================
async function example15Subagent() {
  for await (const message of query({
    prompt: "审查认证模块的安全漏洞",
    options: {
      // Agent 工具是调用子代理所必需的
      allowedTools: ["Read", "Grep", "Glob", "Agent"],
      agents: {
        // 代码审查代理 - 负责质量和安全审查
        "code-reviewer": {
          // description 描述子代理的职责，帮助 Claude 判断何时调用
          description:
            "代码审查专家，专注于质量、安全性和可维护性审查。",
          // prompt 定义子代理的行为和专业知识
          prompt: `你是一位代码审查专家，精通安全、性能和最佳实践。

审查代码时：
- 识别安全漏洞
- 检查性能问题
- 验证是否符合编码规范
- 提出具体的改进建议

反馈要详尽但简洁。`,
          // tools 限制子代理可以使用的工具（这里是只读权限）
          tools: ["Read", "Grep", "Glob"],
        },
        // 测试执行代理 - 负责运行和分析测试
        "test-runner": {
          description:
            "测试执行专家，负责运行测试套件和分析覆盖率。",
          prompt: `你是一位测试执行专家。运行测试并提供清晰的结果分析。

重点关注：
- 运行测试命令
- 分析测试输出
- 识别失败的测试
- 提供修复建议`,
          // 通过 Bash 工具，该子代理可以执行测试命令
          tools: ["Bash", "Read", "Grep"],
        },
      },
    },
  })) {
    // 打印完整消息结构，便于观察子代理的工作过程
    const msgAny = message as any;

    // 处理不同类型的消息
    if (message.type === "system") {
      // 子代理任务开始时会有 system 消息包含 task_type 和 description
      if (msgAny.subtype === "agent_start" || msgAny.subtype === "subagent_start") {
        console.log(`\n🎯 开始子代理: ${msgAny.description || msgAny.task_type || "未知"}`);
        if (msgAny.prompt) {
          console.log("   任务:", msgAny.prompt.substring(0, 100) + "...");
        }
      } else if (msgAny.subtype === "agent_finish" || msgAny.subtype === "subagent_finish") {
        console.log(`\n✅ 子代理完成: ${msgAny.description || "完成"}`);
      } else if (msgAny.usage) {
        // 包含使用统计的消息
        console.log(`\n📊 使用统计:`, JSON.stringify(msgAny.usage).substring(0, 80));
      }
    }

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "text" && c.text?.trim()) {
            const text = c.text.trim();
            if (text.length < 200) {
              console.log(`\n💬 助手回复: ${text}`);
            }
          }
          if (c.type === "tool_use") {
            console.log(`\n🔧 工具调用: ${c.name}`);
            if (c.input) {
              const inputStr = JSON.stringify(c.input).substring(0, 150);
              console.log(`   参数: ${inputStr}...`);
            }
          }
        });
      }
    }

    if (message.type === "user") {
      // 用户消息通常包含工具结果
      if (msgAny.message?.content) {
        msgAny.message.content.forEach((c: any) => {
          if (c.type === "tool_result") {
            const result = typeof c.content === "string" ? c.content : JSON.stringify(c.content);
            console.log(`\n📋 工具结果: ${result.substring(0, 150)}...`);
          }
        });
      }
    }

    if ("result" in message) {
      console.log("\n" + "=".repeat(60));
      console.log("最终结果:", message.result);
    }
  }
}

example15Subagent();