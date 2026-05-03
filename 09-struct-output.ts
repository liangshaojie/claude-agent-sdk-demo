import { z } from "zod";
import { query } from "@anthropic-ai/claude-agent-sdk";

// 使用 Zod 定义输出结构 Schema
const FeaturePlan = z.object({
  feature_name: z.string(),
  summary: z.string(),
  steps: z.array(
    z.object({
      step_number: z.number(),
      description: z.string(),
      estimated_complexity: z.enum(["low", "medium", "high"])
    })
  ),
  risks: z.array(z.string())
});

type FeaturePlan = z.infer<typeof FeaturePlan>;

// 将 Zod schema 转换为 JSON Schema
const schema = z.toJSONSchema(FeaturePlan);

// 使用 query 函数进行结构化输出查询
for await (const message of query({
  prompt:
    "只返回一个JSON对象。不要解释，不要markdown代码块，不要任何其他内容。直接输出纯JSON。\n\n" +
    "JSON格式必须严格遵循：\n" +
    JSON.stringify({
      feature_name: "xxx",
      summary: "xxx",
      steps: [{ step_number: 1, description: "xxx", estimated_complexity: "low|medium|high" }],
      risks: ["xxx"]
    }) + "\n\n" +
    "请填充JSON内容，规划如何在React应用中添加深色模式支持。steps数组中每个元素必须是包含step_number、description、estimated_complexity三个字段的对象。",
  options: {
    outputFormat: {
      type: "json_schema",
      schema: schema
    }
  }
})) {
  // 处理结果消息
  if (message.type === "result" && message.subtype === "success" && (message as any).result) {
    const jsonStr = (message as any).result;
    const cleaned = jsonStr.replace(/,(\s*[}\]])/g, '$1');
    const parsed = FeaturePlan.safeParse(JSON.parse(cleaned));
    if (parsed.success) {
      const plan: FeaturePlan = parsed.data;
      console.log(`Feature: ${plan.feature_name}`);
      console.log(`Summary: ${plan.summary}`);
      plan.steps.forEach((step) => {
        console.log(`${step.step_number}. [${step.estimated_complexity}] ${step.description}`);
      });
      plan.risks.forEach((risk) => {
        console.log(`Risk: ${risk}`);
      });
    }
  }
}