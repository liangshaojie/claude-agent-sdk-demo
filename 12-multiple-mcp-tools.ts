import { tool, createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// 工具1：字符串处理
const stringTools = tool(
  "string_operations",
  "Perform various string operations",
  {
    operation: z.enum(["uppercase", "lowercase", "reverse", "length"]).describe("Operation to perform"),
    text: z.string().describe("Input text")
  },
  async (args) => {
    switch (args.operation) {
      case "uppercase":
        return { content: [{ type: "text", text: args.text.toUpperCase() }] };
      case "lowercase":
        return { content: [{ type: "text", text: args.text.toLowerCase() }] };
      case "reverse":
        return { content: [{ type: "text", text: args.text.split("").reverse().join("") }] };
      case "length":
        return { content: [{ type: "text", text: `Length: ${args.text.length}` }] };
      default:
        return { content: [{ type: "text", text: "Unknown operation" }], isError: true };
    }
  }
);

// 工具2：数组操作
const arrayTools = tool(
  "array_operations",
  "Perform operations on arrays of numbers",
  {
    operation: z.enum(["sum", "average", "max", "min", "sort"]).describe("Operation to perform"),
    numbers: z.array(z.number()).describe("Array of numbers")
  },
  async (args) => {
    const { numbers } = args;

    if (numbers.length === 0) {
      return { content: [{ type: "text", text: "Error: Empty array" }], isError: true };
    }

    let result: string;
    switch (args.operation) {
      case "sum":
        result = `Sum: ${numbers.reduce((a, b) => a + b, 0)}`;
        break;
      case "average":
        result = `Average: ${(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2)}`;
        break;
      case "max":
        result = `Max: ${Math.max(...numbers)}`;
        break;
      case "min":
        result = `Min: ${Math.min(...numbers)}`;
        break;
      case "sort":
        result = `Sorted: [${[...numbers].sort((a, b) => a - b).join(", ")}]`;
        break;
      default:
        result = "Unknown operation";
    }

    return { content: [{ type: "text", text: result }] };
  }
);

// 工具3：随机选择
const randomChoice = tool(
  "random_choice",
  "Randomly select an item from a list",
  {
    options: z.array(z.string()).describe("List of options to choose from")
  },
  async (args) => {
    if (args.options.length === 0) {
      return { content: [{ type: "text", text: "Error: No options provided" }], isError: true };
    }
    const randomIndex = Math.floor(Math.random() * args.options.length);
    return {
      content: [{ type: "text", text: `Selected: "${args.options[randomIndex]}"` }]
    };
  }
);

// 创建包含多个工具的 MCP 服务器
const myServer = createSdkMcpServer({
  name: "utility_tools",
  version: "1.0.0",
  tools: [stringTools, arrayTools, randomChoice]
});

async function main() {
  console.log("=== 示例 12：多个自定义工具与错误处理 ===\n");

  let toolCallCount = 0;

  const prompt = `请依次调用以下工具完成任务：
1. string_operations - 将 "Hello" 转为大写
2. array_operations - 计算 [10, 20, 30] 的总和
3. random_choice - 从 ["A", "B", "C"] 中随机选一个
4. string_operations - 获取 "Test" 的长度
5. array_operations - 找出 [5, 1, 8, 3] 中的最大值`;

  for await (const message of query({
    prompt,
    options: {
      mcpServers: { utility_tools: myServer },
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true
    }
  })) {
    // 打印所有消息类型以便调试
    console.log("[消息类型]:", message.type);

    if (message.type === "content") {
      console.log("\n[助手响应]");
      for (const block of message.content) {
        if (block.type === "text") {
          console.log(block.text);
        }
      }
    }

    if (message.type === "result" && message.subtype === "success") {
      const result = (message as any).result;
      console.log("\n[最终结果]", result);
    }
  }
}

main().catch(console.error);