/**
 * 06-permission-control.ts
 *
 * 权限控制示例：使用 canUseTool 拦截器处理 AskUserQuestion 工具
 *
 * 这个示例演示了如何通过 canUseTool 回调拦截 Claude 的工具调用，
 * 并自定义处理用户交互式问题（AskUserQuestion）
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline/promises";

/**
 * 终端输入提示函数
 * @param question - 显示给用户的问题
 * @returns 用户输入的答案
 */
async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

/**
 * 解析用户输入的选项
 *
 * 支持两种输入方式：
 * 1. 输入选项编号（如 "1,2" 表示选择第1和第2个选项）
 * 2. 直接输入自定义文本
 *
 * @param response - 用户输入的原始字符串
 * @param options - 可选的选项列表
 * @returns 解析后的选项标签或原始输入
 */
function parseResponse(response: string, options: any[]): string {
  // 将输入按逗号分隔，转换为选项索引（减1因为用户输入是1-based）
  const indices = response.split(",").map((s) => parseInt(s.trim()) - 1);
  // 获取有效选项的标签
  const labels = indices
    .filter((i) => !isNaN(i) && i >= 0 && i < options.length)
    .map((i) => options[i].label);
  // 如果有有效选项，返回标签；否则返回原始输入
  return labels.length > 0 ? labels.join(", ") : response;
}

/**
 * 处理 AskUserQuestion 工具的拦截器
 *
 * 当 Claude 调用 AskUserQuestion 时，这个函数会被 canUseTool 回调触发。
 * 它会：
 * 1. 显示问题给用户
 * 2. 列出所有选项
 * 3. 获取用户的选择
 * 4. 将答案返回给 Claude
 *
 * @param input - AskUserQuestion 工具的输入参数，包含 questions 数组
 * @returns PermissionResult，包含问题和答案，让 Claude 继续执行
 */
async function handleAskUserQuestion(input: any) {
  console.log("\n========================================");
  console.log("🔧 [canUseTool 拦截] AskUserQuestion 被调用!");
  console.log("========================================");

  // 从输入中提取问题列表
  const questions = input.questions || [];
  // 存储用户对每个问题的回答
  const answers: Record<string, string> = {};

  // 遍历每个问题，显示给用户并获取回答
  for (const q of questions) {
    // 显示问题的分类标题和问题内容
    console.log(`\n${q.header}: ${q.question}`);

    // 显示所有选项
    const options = q.options || [];
    options.forEach((opt: any, i: number) => {
      console.log(`  ${i + 1}. ${opt.label} - ${opt.description}`);
    });

    // 根据是否允许多选，显示不同的输入提示
    if (q.multiSelect) {
      console.log("  (输入编号用逗号分隔，或直接输入答案)");
    } else {
      console.log("  (输入编号，或直接输入答案)");
    }

    // 获取用户输入并解析
    const response = (await prompt("你的选择: ")).trim();
    answers[q.question] = parseResponse(response, options);
  }

  // 返回允许执行，并将用户答案注入回 input
  // 关键：必须包含原始的 questions，否则 Claude 无法理解答案对应哪个问题
  return {
    behavior: "allow" as const,
    updatedInput: { questions: input.questions, answers }
  };
}

/**
 * 主函数：演示权限控制
 */
async function main() {
  console.log("=== 06-Permission Control 示例 ===\n");
  console.log("说明：通过 AskUserQuestion 工具触发 canUseTool 拦截\n");

  // 记录 canUseTool 被调用的次数
  let canUseToolCount = 0;

  // 使用 query 函数与 Claude 对话
  for await (const message of query({
    // 请求 Claude 帮助选择技术栈，它会通过 AskUserQuestion 询问用户
    prompt: "我需要你问我几个问题来帮我选择技术栈。请问我应该选择 React Native 还是 Flutter？应该使用什么状态管理方案？",
    options: {
      // 从项目配置中读取设置（如 skills 等）
      settingSources: ["project"],
      // 允许使用的工具：Read、Grep、Glob（用于代码分析）
      allowedTools: ["Read", "Grep", "Glob"],
      // 权限模式：自动批准文件编辑操作
      permissionMode: "acceptEdits",
      // 核心：canUseTool 拦截器
      canUseTool: async (toolName, input) => {
        canUseToolCount++;
        console.log(`\n>>> [canUseTool #${canUseToolCount}] 被调用!`);
        console.log("Tool:", toolName);

        // 专门处理 AskUserQuestion 工具
        if (toolName === "AskUserQuestion") {
          return handleAskUserQuestion(input);
        }

        // 其他工具默认全部允许
        return { behavior: "allow" as const, updatedInput: input };
      },
    },
  })) {
    // 处理 Claude 的回复
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          // 显示 Claude 的文本回复
          console.log(`\n[Claude]: ${block.text.substring(0, 300)}`);
        } else if ("name" in block) {
          // 显示工具调用信息
          console.log(`\n[Tool]: ${block.name}`);
        }
      }
    }
    // 处理最终结果
    if (message.type === "result") {
      console.log(`\n========================================`);
      console.log("完成! subtype:", message.subtype);
      console.log("canUseTool 调用次数:", canUseToolCount);
      console.log("========================================");
    }
  }
}

// 启动主函数，捕获并打印错误
main().catch(console.error);