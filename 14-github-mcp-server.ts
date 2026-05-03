import { query } from "@anthropic-ai/claude-agent-sdk";

/**
 * 示例 14：使用 GitHub MCP 服务器列出仓库 Issues
 *
 * 需要设置环境变量 GITHUB_TOKEN（GitHub Personal Access Token）
 *
 * 运行前确保已安装：
 *   npx -y @modelcontextprotocol/server-github
 */
async function main() {
  console.log("=== 示例 14：使用 GitHub MCP 服务器 ===\n");

  // 检查环境变量
  if (!process.env.GITHUB_TOKEN) {
    console.error("错误：请设置 GITHUB_TOKEN 环境变量");
    console.log("  export GITHUB_TOKEN=your_github_token_here");
    process.exit(1);
  }

  console.log("查询 anthropics/claude-code 最近 3 个 Issues...\n");

  for await (const message of query({
    prompt: "List the 3 most recent issues in anthropics/claude-code",
    options: {
      mcpServers: {
        github: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-github"],
          env: {
            GITHUB_TOKEN: process.env.GITHUB_TOKEN
          }
        }
      },
      allowedTools: ["mcp__github__list_issues"]
    }
  })) {
    // MCP 服务器初始化成功
    if (message.type === "system" && message.subtype === "init") {
      console.log("✓ MCP 服务器已连接:", message.mcp_servers);
    }

    // 打印 Claude 调用的 MCP 工具
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "tool_use" && block.name.startsWith("mcp__github__")) {
          console.log("→ 调用工具:", block.name);
        }
      }
    }

    // 打印最终结果
    if (message.type === "result" && message.subtype === "success") {
      console.log("\n📋 结果:");
      console.log(message.result);
    }

    // 处理错误
    if (message.type === "result" && message.subtype === "error") {
      console.error("✗ 错误:", message.result);
    }
  }
}

main().catch(console.error);