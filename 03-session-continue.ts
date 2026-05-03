import { query } from "@anthropic-ai/claude-agent-sdk";

// Example 03: Continue a session
async function main() {
  console.log("=== First query: 创建新会话 ===");

  for await (const message of query({
    prompt: "列举你知道的 skill 名称，随便说5个",
    options: {
      settingSources: ["project"],
      allowedTools: ["Read", "Grep", "Glob"],
      permissionMode: "acceptEdits",
    },
  })) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`Assistant: ${block.text}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`Done: ${message.subtype}`);
    }
  }

  console.log("\n=== Second query: 继续上一个会话 ===");

  for await (const message of query({
    prompt: "把刚才说的第3个skill详细解释一下",
    options: {
      continue: true,
      settingSources: ["project"],
      allowedTools: ["Read", "Grep", "Glob"],
      permissionMode: "acceptEdits",
    },
  })) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`Assistant: ${block.text}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`Done: ${message.subtype}`);
    }
  }
}

main();