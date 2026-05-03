import { query } from "@anthropic-ai/claude-agent-sdk";

// Example 02: Search and explain code
for await (const message of query({
  prompt:
    "我都配置了哪些skill",
  options: {
    settingSources: ["project"],
    allowedTools: ["Read", "Grep", "Glob"],
    permissionMode: "acceptEdits",
  },
})) {
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`);
  }
}
