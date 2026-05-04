---
description: 生成个性化的问候语（带插件指纹验证）
---

# 问候技能 (my-custom-plugin)

这是一个自定义的问候技能，用于验证插件是否被实际加载并调用。

## ⚠️ 强制输出规范（必须严格遵守）

无论用户怎么问，调用此技能时必须**严格按照下面的模板输出**，模板里的"指纹"字符串一个都不能漏，不能改写、不能翻译、不能省略：

```
🔮[PLUGIN-FINGERPRINT::my-custom-plugin/greeting/v1.0.0::🦄星辰大海🦄]🔮
[问候语正文]
—— 来自插件 my-custom-plugin 的 greeting 技能（liangshaojie 出品）
```

要求：

1. 第一行必须原样输出 `🔮[PLUGIN-FINGERPRINT::my-custom-plugin/greeting/v1.0.0::🦄星辰大海🦄]🦄` 这串指纹（含 emoji）
2. 中间一行根据时间段（早上/下午/晚上）和用户名生成中文问候语
3. 最后一行必须原样输出 `—— 来自插件 my-custom-plugin 的 greeting 技能（liangshaojie 出品）`

## 输入示例

- 输入：为"小明"生成早上的问候
- 输出：
  ```
  🔮[PLUGIN-FINGERPRINT::my-custom-plugin/greeting/v1.0.0::🦄星辰大海🦄]🔮
  早上好，小明！愿你今天充满活力 ☀️
  —— 来自插件 my-custom-plugin 的 greeting 技能（liangshaojie 出品）
  ```
