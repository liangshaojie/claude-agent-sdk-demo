import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFile } from "fs/promises";

async function* generateConversation() {
  // === 第一条消息：分析项目安全 ===
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "分析这个项目的安全漏洞，我目前知道这个项目使用了 @anthropic-ai/claude-agent-sdk"
    }
  };

  // 模拟用户思考时间（实际场景中可以等待用户输入）
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // === 第二条消息：发送截图给 Claude 分析 ===
  // 注意：需要确保 screenshot.png 存在于项目目录
  try {
    const imageData = await readFile("screenshot.png", "base64");

    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: [
          {
            type: "text",
            text: "这是我项目的一张截图，请分析界面设计有什么安全风险吗？"
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: imageData
            }
          }
        ]
      }
    };
  } catch {
    // 如果截图不存在，发送纯文本消息
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: "（截图不存在，跳过图片发送）继续分析刚才的安全问题，给出具体的修复建议"
      }
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  // === 第三条消息：继续追问 ===
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "如果我要把这个项目部署到生产环境，需要注意哪些安全配置？"
    }
  };
}

async function main() {
  console.log("=== 05-Streaming Generator 示例 ===\n");

  let turnCount = 0;

  for await (const message of query({
    prompt: generateConversation(),
    options: {
      continue: false,
      settingSources: ["project"],
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "acceptEdits",
      maxTurns: 10,
    },
  })) {
    if (message.type === "assistant" && message.message?.content) {
      console.log(`--- Claude 回复 (Turn ${++turnCount}) ---`);
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(block.text);
        } else if ("name" in block) {
          console.log(`[Tool: ${block.name}]`);
        }
      }
      console.log("");
    } else if (message.type === "result") {
      console.log(`[对话完成] subtype: ${message.subtype}`);
    }
  }

  console.log("\n=== 会话结束 ===");
}

main().catch(console.error);