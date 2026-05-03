import { query } from "@anthropic-ai/claude-agent-sdk";

// MCP 服务器配置（HTTP 传输）
const docsServer = {
  type: "http",
  url: "https://claude.com/docs/mcp"
};

async function main() {
  console.log("=== 示例 13：使用 HTTP MCP 服务器 ===\n");

  for await (const message of query({
    prompt: "请查询 MCP 服务器中关于 tools 的文档内容",
    options: {
      mcpServers: {
        "claude-docs": docsServer
      },
      // 限制只能使用 MCP 工具
      allowedTools: ["mcp__claude-docs__*"],
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