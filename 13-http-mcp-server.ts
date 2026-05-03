import { query } from "@anthropic-ai/claude-agent-sdk";

// MCP 服务器配置（HTTP 传输）
// 使用 Claude Code 官方的 MCP 文档服务器
const docsServer = {
  type: "http" as const,
  url: "https://code.claude.com/docs/mcp"
};

async function main() {
  console.log("=== 示例 13：使用 HTTP MCP 服务器 ===\n");

  for await (const message of query({
    prompt: "请查询 Claude Agent SDK (TypeScript/JavaScript) 中关于如何创建和使用 MCP 工具的文档内容，包括 tool() 函数、createSdkMcpServer() 的用法",
    options: {
      mcpServers: {
        "claude-code-docs": docsServer
      },
      // 限制只能使用 MCP 工具
      allowedTools: ["mcp__claude-code-docs__*"],
      permissionMode: 'bypassPermissions'
    }
  })) {
    if (message.type === "content") {
      console.log("[助手响应]");
      for (const block of message.content) {
        if (block.type === "text") {
          console.log(block.text);
        }
      }
    }

    if (message.type === "result" && message.subtype === "success") {
      console.log("\n[最终结果]", (message as any).result);
    }
  }
}

main().catch(console.error);