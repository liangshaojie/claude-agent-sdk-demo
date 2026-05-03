import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// 定义一个获取天气信息的工具
const getWeather = tool(
  "get_weather",
  "获取指定城市的当前天气信息",
  {
    city: z.string().describe("城市名称")
  },
  async (args) => {
    const city = args.city;
    // 模拟天气数据（更具中国城市特色）
    const weathers: Record<string, string> = {
      "北京": "晴，微风，气温15-26°C，空气质量良好",
      "上海": "多云，东南风2-3级，气温17-25°C",
      "广州": "雷阵雨，气温24-31°C，出门记得带伞",
      "深圳": "晴间多云，气温23-30°C",
      "成都": "阴天，有小雨，气温16-22°C",
      "杭州": "多云转晴，气温18-28°C，西湖边适宜散步"
    };
    const weather = weathers[city] || `未知城市 ${city}`;

    console.log(`[Tool Called] getWeather called with city: ${city}`);

    return {
      content: [{ type: "text", text: `${city}的天气：${weather}` }]
    };
  }
);

// 定义一个计算器工具
const calculate = tool(
  "calculate",
  "执行简单的数学计算",
  {
    expression: z.string().describe("数学表达式，如 2+3*4")
  },
  async (args) => {
    const expr = args.expression;
    try {
      // 使用 Function 构造器安全地计算表达式（支持括号）
      const result = Function(`"use strict"; return (${expr})`)();
      console.log(`[Tool Called] calculate called with expression: ${args.expression}`);
      return {
        content: [{ type: "text", text: `${args.expression} = ${result}` }]
      };
    } catch {
      return {
        content: [{ type: "text", text: `无法计算: ${args.expression}` }]
      };
    }
  }
);

// 创建 MCP 服务器，包装工具
const myServer = createSdkMcpServer({
  name: "my_tools",
  version: "1.0.0",
  tools: [getWeather, calculate]
});

import { query } from "@anthropic-ai/claude-agent-sdk";

// 使用自定义工具进行查询
for await (const message of query({
  prompt: "请完成以下任务：\n1. 调用 get_weather 工具查询北京和上海的天气\n2. 调用 calculate 工具计算 (15 + 25) * 2 的结果\n\n以JSON格式输出结果：{\"weather_results\":[\"...\",\"...\"],\"calc_result\":\"...\"}",
  options: {
    mcpServers: {
      my_tools: myServer
    },
    permissionMode: 'bypassPermissions',
    allowDangerouslySkipPermissions: true
  }
})) {
  if (message.type === "result" && message.subtype === "success" && (message as any).result) {
    console.log((message as any).result);
  }
}