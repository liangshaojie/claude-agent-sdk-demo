/**
 * Claude Agent SDK 示例17 - Skills（技能）系统
 * 展示如何使用 Agent Skills 扩展 Claude 的能力
 * 
 * Skills 是定义在文件系统中的专业能力模块，可以让 Claude 在特定领域表现得更专业
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================
// 示例 1: 基础 Skills 使用
// ============================================
async function example1BasicSkills() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 1: 基础 Skills 使用");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: "列出当前项目中可用的所有 Skills",
    options: {
      // 启用 Skill 工具
      allowedTools: ["Skill", "Read", "Glob"],
      // 从文件系统加载 Skills
      // "user": 从 ~/.claude/skills/ 加载用户全局 Skills
      // "project": 从当前项目的 .claude/skills/ 加载项目 Skills
      settingSources: ["user", "project"],
      maxTurns: 3,
    },
  })) {
    if (message.type === "result") {
      console.log("\n📋 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 2: PDF 处理 Skill
// ============================================
async function example2PdfProcessing() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 2: 使用 PDF 处理 Skill");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: `我有一个 PDF 文件需要处理。请帮我：
1. 检查是否安装了 pdftotext 工具
2. 如果有示例 PDF，提取其文本内容
3. 总结提取的内容`,
    options: {
      // PDF 处理需要 Bash 工具来运行命令
      allowedTools: ["Skill", "Read", "Bash", "Glob"],
      settingSources: ["project"],
      maxTurns: 10,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "text" && c.text?.trim()) {
            console.log("\n💬 助手:", c.text.trim().substring(0, 200));
          }
          if (c.type === "tool_use") {
            console.log(`\n🔧 调用工具: ${c.name}`);
            if (c.name === "Skill") {
              console.log(`   技能: ${c.input?.skill || "未知"}`);
            }
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("📋 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 3: 数据分析 Skill
// ============================================
async function example3DataAnalysis() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 3: 使用数据分析 Skill");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: `请帮我分析项目中的数据文件：
1. 查找所有 CSV 或 JSON 数据文件
2. 选择一个文件进行分析
3. 提供数据概览和统计摘要
4. 给出数据质量评估和可视化建议`,
    options: {
      allowedTools: ["Skill", "Read", "Bash", "Grep", "Glob"],
      settingSources: ["project"],
      maxTurns: 15,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "text" && c.text?.trim()) {
            const text = c.text.trim();
            // 只显示较短的文本，避免输出过长
            if (text.length < 300) {
              console.log("\n💬 助手:", text);
            } else {
              console.log("\n💬 助手:", text.substring(0, 200) + "...");
            }
          }
          if (c.type === "tool_use") {
            console.log(`\n🔧 调用工具: ${c.name}`);
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("📊 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 4: 代码重构 Skill
// ============================================
async function example4CodeRefactoring() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 4: 使用代码重构 Skill");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: `请帮我分析项目中的 TypeScript 代码质量：
1. 查找所有 .ts 文件
2. 识别可能存在的代码异味（长函数、重复代码等）
3. 提供具体的重构建议
4. 给出重构优先级和计划`,
    options: {
      allowedTools: ["Skill", "Read", "Bash", "Grep", "Glob"],
      settingSources: ["project"],
      maxTurns: 15,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "text" && c.text?.trim()) {
            const text = c.text.trim();
            console.log("\n💬 助手:", text.substring(0, 250));
          }
          if (c.type === "tool_use") {
            console.log(`\n🔧 调用工具: ${c.name}`);
            if (c.input) {
              const inputStr = JSON.stringify(c.input).substring(0, 100);
              console.log(`   参数: ${inputStr}...`);
            }
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("🔍 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 5: 多 Skill 协作
// ============================================
async function example5MultiSkillCollaboration() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 5: 多 Skill 协作");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: `综合任务：
1. 使用代码重构 Skill 分析项目代码质量
2. 如果有数据文件，使用数据分析 Skill 进行分析
3. 生成一份项目质量报告，包括代码质量和数据质量
4. 提供改进建议`,
    options: {
      // 提供完整的工具集，让 Skills 可以充分发挥
      allowedTools: ["Skill", "Read", "Write", "Bash", "Grep", "Glob"],
      settingSources: ["project"],
      maxTurns: 20,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "system") {
      if (msgAny.subtype === "agent_start") {
        console.log(`\n🎯 开始任务: ${msgAny.description || "未知"}`);
      } else if (msgAny.subtype === "agent_finish") {
        console.log(`\n✅ 任务完成`);
      }
    }

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "text" && c.text?.trim()) {
            const text = c.text.trim();
            if (text.length < 200) {
              console.log(`\n💬 ${text}`);
            }
          }
          if (c.type === "tool_use") {
            console.log(`\n🔧 ${c.name}`);
            if (c.name === "Skill") {
              console.log(`   📚 技能: ${c.input?.skill || "未知"}`);
            }
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("📄 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 6: Skills 与子代理结合
// ============================================
async function example6SkillsWithSubagents() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 6: Skills 与子代理结合");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: "分析项目的整体健康度，包括代码质量、数据质量和文档完整性",
    options: {
      allowedTools: ["Skill", "Read", "Bash", "Grep", "Glob", "Agent"],
      settingSources: ["project"],
      // 定义专门的子代理，每个代理可以使用 Skills
      agents: {
        // 代码质量分析代理
        "code-quality-agent": {
          description: "代码质量分析专家，使用代码重构 Skill 进行深度分析",
          prompt: `你是代码质量分析专家。使用代码重构 Skill 来：
1. 识别代码异味和质量问题
2. 评估代码复杂度
3. 提供重构建议

重点关注：
- 函数长度和复杂度
- 代码重复
- 命名规范
- 最佳实践`,
          tools: ["Skill", "Read", "Grep", "Glob", "Bash"],
        },
        // 数据质量分析代理
        "data-quality-agent": {
          description: "数据质量分析专家，使用数据分析 Skill 评估数据资产",
          prompt: `你是数据质量分析专家。使用数据分析 Skill 来：
1. 发现和分析数据文件
2. 评估数据质量
3. 提供数据改进建议

重点关注：
- 数据完整性
- 数据一致性
- 数据格式规范`,
          tools: ["Skill", "Read", "Bash", "Grep", "Glob"],
        },
      },
      maxTurns: 25,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "system") {
      if (msgAny.subtype === "agent_start" || msgAny.subtype === "subagent_start") {
        console.log(`\n🤖 启动代理: ${msgAny.description || "未知"}`);
      } else if (msgAny.subtype === "agent_finish" || msgAny.subtype === "subagent_finish") {
        console.log(`\n✅ 代理完成`);
      }
    }

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "tool_use") {
            if (c.name === "Agent") {
              console.log(`\n👥 调用子代理: ${c.input?.agent || "未知"}`);
            } else if (c.name === "Skill") {
              console.log(`\n📚 使用技能: ${c.input?.skill || "未知"}`);
            } else {
              console.log(`\n🔧 使用工具: ${c.name}`);
            }
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("🏥 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 7: 发现和测试 Skills
// ============================================
async function example7DiscoverSkills() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 7: 发现和测试 Skills");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: `请帮我：
1. 列出所有可用的 Skills 及其描述
2. 解释每个 Skill 的用途
3. 给出使用示例`,
    options: {
      allowedTools: ["Skill", "Read", "Glob"],
      settingSources: ["project"],
      maxTurns: 5,
    },
  })) {
    if (message.type === "result") {
      console.log("\n📚 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 示例 8: 限制 Skill 可用工具
// ============================================
async function example8RestrictedSkillTools() {
  console.log("\n" + "=".repeat(60));
  console.log("示例 8: 限制 Skill 可用工具（只读模式）");
  console.log("=".repeat(60));

  for await (const message of query({
    prompt: "分析项目代码质量，但不要执行任何修改操作",
    options: {
      // 只提供只读工具，Skills 无法执行写入或命令
      allowedTools: ["Skill", "Read", "Grep", "Glob"],
      settingSources: ["project"],
      maxTurns: 10,
    },
  })) {
    const msgAny = message as any;

    if (message.type === "assistant") {
      const msg = msgAny.message;
      if (msg?.content) {
        msg.content.forEach((c: any) => {
          if (c.type === "tool_use") {
            console.log(`\n🔧 工具调用: ${c.name}`);
            // 验证没有使用 Write 或 Bash 等危险工具
            if (c.name === "Write" || c.name === "Bash") {
              console.log("   ⚠️  警告: 尝试使用受限工具!");
            }
          }
        });
      }
    }

    if (message.type === "result") {
      console.log("\n" + "=".repeat(60));
      console.log("📋 任务完成，状态:", message.subtype);
    }
  }
}

// ============================================
// 主函数：运行所有示例
// ============================================
async function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   Claude Agent SDK - Skills（技能）系统完整示例           ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\nSkills 是 Claude Agent 的专业能力扩展系统");
  console.log("通过定义 SKILL.md 文件，可以让 Claude 在特定领域更专业\n");

  try {
    // 运行示例（可以注释掉不需要的示例）
    
    // 基础示例
    await example1BasicSkills();
    
    // 单个 Skill 使用示例
    await example2PdfProcessing();
    await example3DataAnalysis();
    await example4CodeRefactoring();
    
    // 高级示例
    await example5MultiSkillCollaboration();
    await example6SkillsWithSubagents();
    
    // 工具示例
    await example7DiscoverSkills();
    await example8RestrictedSkillTools();

    console.log("\n" + "=".repeat(60));
    console.log("✅ 所有示例运行完成!");
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("\n❌ 错误:", error);
  }
}

// 运行主函数
main();
