import { query } from "@anthropic-ai/claude-agent-sdk";

// Example 04: Session management with history
async function main() {
  // === 多轮对话：完整的会话流程 ===
  console.log("=== 会话开始 ===\n");

  // Round 1: 询问项目结构
  const round1 = query({
    prompt: "我的项目根目录在哪里？列出根目录下的文件和文件夹",
    options: {
      settingSources: ["project"],
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "acceptEdits",
      maxTurns: 3,
    },
  });

  for await (const message of round1) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`Round1: ${block.text}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`\n[Round1 完成] subtype: ${message.subtype}\n`);
    }
  }

  // Round 2: 继续会话 - 询问具体文件
  console.log("=== 继续会话 ===\n");

  const round2 = query({
    prompt: "刚才列出的文件夹中，哪个是源码目录？查看里面的 ts 文件",
    options: {
      continue: true, // 继续上一个会话
      settingSources: ["project"],
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "acceptEdits",
      maxTurns: 3,
    },
  });

  for await (const message of round2) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`Round2: ${block.text}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`\n[Round2 完成] subtype: ${message.subtype}\n`);
    }
  }

  // Round 3: 深入查看某个具体文件
  console.log("=== 再次继续 ===\n");

  const round3 = query({
    prompt: "现在查看 02-code-search.ts 这个文件的内容",
    options: {
      continue: true, // 继续上一个会话（已经是第3轮了）
      settingSources: ["project"],
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "acceptEdits",
      maxTurns: 2,
    },
  });

  for await (const message of round3) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`Round3: ${block.text}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`\n[Round3 完成] subtype: ${message.subtype}\n`);
    }
  }

  console.log("=== 会话结束 ===");
}

main();