import { query } from "@anthropic-ai/claude-agent-sdk";

// 定义 TODO 提取的结构
const todoSchema = {
  type: "object",
  properties: {
    todos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          file: { type: "string" },
          line: { type: "number" },
          author: { type: "string" },
          date: { type: "string" }
        },
        required: ["text", "file", "line"]
      }
    },
    total_count: { type: "number" }
  },
  required: ["todos", "total_count"]
};

// 使用 Agent 的 Grep 查找 TODOs，Bash 获取 git blame 信息
for await (const message of query({
  prompt: "使用 Grep 工具搜索代码库中的 TODO 注释。你必须实际调用工具来搜索，不要仅凭直觉回答。\n\n" +
    "只返回纯JSON格式：{\"todos\":[{\"text\":\"...\",\"file\":\"...\",\"line\":N,\"author\":\"...\",\"date\":\"...\"}],\"total_count\":N}\n\n" +
    "如果没找到TODO，total_count设为0，todos为空数组。",
  options: {
    outputFormat: {
      type: "json_schema",
      schema: todoSchema
    }
  }
})) {
  if (message.type === "result" && message.subtype === "success" && (message as any).result) {
    const data = JSON.parse((message as any).result) as {
      total_count: number;
      todos: Array<{
        file: string;
        line: number;
        text: string;
        author?: string;
        date?: string;
      }>;
    };
    console.log(`Found ${data.total_count} TODOs`);
    data.todos.forEach((todo) => {
      console.log(`${todo.file}:${todo.line} - ${todo.text}`);
      if (todo.author) {
        console.log(`  Added by ${todo.author} on ${todo.date}`);
      }
    });
  }
}