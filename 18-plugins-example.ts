/**
 * Plugin（插件）系统示例
 * 
 * 演示如何创建和使用插件包
 * 插件的作用：将 skills、agents、commands、hooks 等打包成一个完整的包，便于分发和复用
 * 
 * 插件结构：
 * my-custom-plugin/
 * ├── .claude-plugin/
 * │   └── plugin.json       # 必需：插件清单
 * ├── skills/               # 技能
 * │   ├── greeting/
 * │   └── task-planner/
 * └── agents/               # 代理
 *     └── code-reviewer.md
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 工具函数：打印分隔线
function printSeparator(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * 示例 1: 加载插件包
 * 
 * 演示如何通过 plugins 选项加载一个完整的插件包
 * 插件包包含：skills、agents、commands 等所有组件
 */
async function example1LoadPlugin() {
  printSeparator('示例 1: 加载插件包');

  const pluginPath = path.join(__dirname, 'my-custom-plugin');
  console.log('📦 加载插件:', pluginPath);
  console.log('💡 插件包含: skills (greeting, task-planner) + agents (code-reviewer)\n');

  for await (const message of query({
    prompt: '你好，请列出你现在可用的技能',
    options: {
      plugins: [
        { type: 'local', path: pluginPath }
      ],
      maxTurns: 3
    }
  })) {
    // 系统初始化消息 - 查看插件是否加载成功
    if (message.type === 'system' && message.subtype === 'init') {
      console.log('✅ 已加载的插件:', message.plugins);
      console.log('\n📋 可用的命令（包含插件提供的）:');
      
      // 筛选出插件相关的命令
      const pluginCommands = message.slash_commands?.filter(cmd => 
        cmd.includes('my-custom-plugin') || 
        cmd.includes('greeting') || 
        cmd.includes('task-planner')
      );
      
      if (pluginCommands && pluginCommands.length > 0) {
        console.log('🎉 插件命令:', pluginCommands);
      } else {
        console.log('⚠️  未检测到插件命令');
      }
      
      console.log('\n所有命令数量:', message.slash_commands?.length);
    }

    if (message.type === 'assistant') {
      console.log('\n🤖 助手:', message.message.content);
    }
  }
}

/**
 * 示例 2: 使用插件命名空间调用技能
 * 
 * 演示如何使用 /plugin-name:skill-name 格式调用插件中的技能
 */
async function example2UsePluginSkill() {
  printSeparator('示例 2: 使用插件技能（命名空间） + 指纹校验');

  const pluginPath = path.join(__dirname, 'my-custom-plugin');

  // 在 SKILL.md 中预埋的"指纹"字符串：只要模型真的读取了插件里的 SKILL.md，
  // 就会在最终回复中原样吐出这两段；否则说明根本没走插件
  const FINGERPRINT_HEAD = '🔮[PLUGIN-FINGERPRINT::my-custom-plugin/greeting/v1.0.0::🦄星辰大海🦄]🔮';
  const FINGERPRINT_TAIL = '来自插件 my-custom-plugin 的 greeting 技能（liangshaojie 出品）';

  console.log('💡 使用命名空间调用插件技能: /my-custom-plugin:greeting\n');
  console.log('🔍 预期指纹（必须同时出现才算真正走了插件）:');
  console.log('   ' + FINGERPRINT_HEAD);
  console.log('   ' + FINGERPRINT_TAIL + '\n');

  // 累积所有 assistant 文本，便于最终一次性匹配指纹
  let assistantText = '';

  for await (const message of query({
    prompt: '/my-custom-plugin:greeting 为用户 "小明" 生成一个早上的问候语',
    options: {
      plugins: [
        { type: 'local', path: pluginPath }
      ],
      maxTurns: 5
    }
  })) {
    if (message.type === 'assistant') {
      console.log('🤖 助手:', message.message.content);
      // 把 assistant 消息里的所有 text 块拼起来用于指纹匹配
      for (const block of message.message.content) {
        if ((block as any).type === 'text') {
          assistantText += (block as any).text + '\n';
        }
      }
    }
  }

  // ===== 指纹断言 =====
  console.log('\n' + '-'.repeat(60));
  console.log('🧪 指纹校验结果:');

  const hasHead = assistantText.includes(FINGERPRINT_HEAD);
  const hasTail = assistantText.includes(FINGERPRINT_TAIL);

  console.log(`   头部指纹 ${FINGERPRINT_HEAD} : ${hasHead ? '✅ 命中' : '❌ 未命中'}`);
  console.log(`   尾部指纹 "${FINGERPRINT_TAIL}" : ${hasTail ? '✅ 命中' : '❌ 未命中'}`);

  if (hasHead && hasTail) {
    console.log('\n🎉 验证通过：模型确实读取并执行了插件中的 SKILL.md，插件已生效！');
  } else {
    console.log('\n⚠️  验证失败：响应中缺少指纹，说明可能走了内置回答而非插件技能。');
  }
}

/**
 * 示例 3: 使用插件中的任务规划技能
 * 
 * 演示插件中更复杂的技能使用
 */
async function example3TaskPlanningSkill() {
  printSeparator('示例 3: 任务规划技能');

  const pluginPath = path.join(__dirname, 'my-custom-plugin');
  
  console.log('💡 调用插件的任务规划技能\n');

  for await (const message of query({
    prompt: '使用任务规划技能，帮我制定一个学习 TypeScript 的计划',
    options: {
      plugins: [
        { type: 'local', path: pluginPath }
      ],
      maxTurns: 5
    }
  })) {
    if (message.type === 'assistant') {
      console.log('🤖 助手:', message.message.content);
    }
  }
}

/**
 * 示例 4: 加载多个插件
 * 
 * 演示如何同时加载多个插件包
 */
async function example4MultiplePlugins() {
  printSeparator('示例 4: 加载多个插件');

  const customPlugin = path.join(__dirname, 'my-custom-plugin');
  
  console.log('💡 可以同时加载多个插件包\n');

  for await (const message of query({
    prompt: '列出所有可用的插件和技能',
    options: {
      plugins: [
        { type: 'local', path: customPlugin },
        // 可以添加更多插件
        // { type: 'local', path: './another-plugin' }
      ],
      maxTurns: 3
    }
  })) {
    if (message.type === 'system' && message.subtype === 'init') {
      console.log('✅ 已加载的插件数量:', message.plugins?.length || 0);
      console.log('📦 插件列表:', message.plugins);
    }

    if (message.type === 'assistant') {
      console.log('\n🤖 助手:', message.message.content);
    }
  }
}

/**
 * 示例 5: 插件与项目配置结合
 * 
 * 演示如何同时使用插件和项目配置
 */
async function example5PluginWithProjectConfig() {
  printSeparator('示例 5: 插件 + 项目配置');

  const pluginPath = path.join(__dirname, 'my-custom-plugin');
  
  console.log('💡 同时使用插件和项目配置\n');
  console.log('   - plugins: 加载插件包');
  console.log('   - settingSources: 加载项目 .claude/ 配置\n');

  for await (const message of query({
    prompt: '列出所有可用的技能（包括插件和项目配置）',
    options: {
      plugins: [
        { type: 'local', path: pluginPath }
      ],
      settingSources: ['project'],
      allowedTools: ['Skill'],
      maxTurns: 3
    }
  })) {
    if (message.type === 'system' && message.subtype === 'init') {
      console.log('✅ 配置已加载');
      console.log('📋 技能总数:', message.slash_commands?.length || 0);
      
      // 显示部分技能
      const skills = message.slash_commands?.filter(cmd => 
        cmd.includes('greeting') || 
        cmd.includes('task-planner') ||
        cmd.includes('code-refactor') ||
        cmd.includes('data-analyzer')
      );
      console.log('🎯 部分技能:', skills);
    }

    if (message.type === 'assistant') {
      console.log('\n🤖 助手:', message.message.content);
    }
  }
}

/**
 * 示例 6: 验证插件结构
 * 
 * 演示如何验证插件是否正确配置
 */
async function example6ValidatePlugin() {
  printSeparator('示例 6: 验证插件结构');

  const pluginPath = path.join(__dirname, 'my-custom-plugin');

  console.log('🔍 验证插件结构...');
  console.log('插件路径:', pluginPath);
  console.log('\n期望的插件结构:');
  console.log('my-custom-plugin/');
  console.log('├── .claude-plugin/');
  console.log('│   └── plugin.json       # 必需：插件清单');
  console.log('├── skills/               # 技能目录');
  console.log('│   ├── greeting/');
  console.log('│   │   └── SKILL.md');
  console.log('│   └── task-planner/');
  console.log('│       └── SKILL.md');
  console.log('└── agents/               # 代理目录');
  console.log('    └── code-reviewer.md\n');

  for await (const message of query({
    prompt: '验证插件加载状态',
    options: {
      plugins: [
        { type: 'local', path: pluginPath }
      ],
      maxTurns: 2
    }
  })) {
    if (message.type === 'system' && message.subtype === 'init') {
      console.log('✅ 插件验证结果:');
      console.log('已加载插件:', message.plugins);
      
      // 检查是否成功加载
      const pluginLoaded = message.plugins?.some(p => p.name === 'my-custom-plugin');
      
      if (pluginLoaded) {
        console.log('\n🎉 插件加载成功！');
        console.log('可以使用以下命令调用插件技能：');
        console.log('  - /my-custom-plugin:greeting');
        console.log('  - /my-custom-plugin:task-planner');
      } else {
        console.log('\n⚠️  插件未加载，可能的原因：');
        console.log('  1. 缺少 .claude-plugin/plugin.json 文件');
        console.log('  2. plugin.json 格式不正确');
        console.log('  3. 插件路径不正确');
      }
    }

    if (message.type === 'assistant') {
      console.log('\n🤖 助手:', message.message.content);
    }
  }
}

// 主函数：运行所有示例
async function main() {
  console.log('🚀 Claude Agent SDK - Plugin 系统示例\n');
  console.log('💡 插件的作用：');
  console.log('   将 skills、agents、commands、hooks 等打包成一个完整的包');
  console.log('   便于分发、复用和版本管理\n');

  try {
    // 运行示例（可以注释掉不需要的示例）
    // await example1LoadPlugin();
    await example2UsePluginSkill();
    // await example3TaskPlanningSkill();
    // await example4MultiplePlugins();
    // await example5PluginWithProjectConfig();
    // await example6ValidatePlugin();

    console.log('\n✅ 所有示例运行完成！');
    console.log('\n📚 关键要点：');
    console.log('   1. 插件 = 完整的功能包（skills + agents + commands + ...）');
    console.log('   2. 使用 plugins: [{ type: "local", path: "./my-plugin" }] 加载');
    console.log('   3. 使用 /plugin-name:skill-name 调用插件技能');
    console.log('   4. 插件可以与项目配置 (settingSources) 结合使用');
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 运行主函数
main();
