# 骨碌（Gulu）· 从 0 到 1

> **主动找你聊天的 AI ——「命中注定的灵魂盲盒」。**
> 随机性格、不可定义、不完美的对话体验。
>
> 本仓库记录骨碌从市场调研 → 产品定义 → 交互设计 → Demo 落地 → 效果评测的完整过程。

---

## 一、架构总览（一条链路）

```
飞书用户
  │  ①② 发消息 / 收消息
  ▼
飞书企业自建应用（机器人）        ← 长连接（WebSocket），订阅 im.message.receive_v1
  │  ③ 事件
  ▼
codex_workspace_bot（本机 Mac · Go 编排器 · MySQL 8.4 · launchd 常驻）
  │  ④ 按「飞书 App + 频道」找到对应 workspace，驱动长期运行的 codex app-server --stdio
  ▼
Codex（本机 CLI）
  │  ⑤ 按模型配置调用
  ▼
阿里云百炼 Token Plan 个人版  ──  主模型：DeepSeek-v4.1-flush
  │  ⑥ 生成
  ▼
骨碌 Workspace（gulu-app）：AGENTS.md（人设/指令）+ 8 Skill + scripts + knowledge + memory
  │  ⑦ 结果回传
  ▼
codex_workspace_bot → 飞书机器人 → 飞书用户（①）
```

**一次用户对话（UC-01）**：飞书消息 → 长连接事件 → 按「App + 频道」定位 workspace → 加载 `AGENTS.md` + 相应 Skill → `load_context` → `persona_render`（`llm_generate` → 模型）→ `pre_send_check` → 输出 + `record_interaction`。

## 二、分层与职责

| 层 | 组件 | 职责 | 关键点 |
| --- | --- | --- | --- |
| 交互层 | 飞书企业自建应用（机器人） | 收 / 发消息（单聊 & 群聊） | **长连接（WebSocket）** 接收事件；订阅 `im.message.receive_v1`；最小权限 |
| 运行时层 | **codex_workspace_bot**（Go，本机 Mac） | 编排：多飞书 App、多 Workspace；同频道串行、跨频道并行；结果回传 | `listen 127.0.0.1:8080`；MySQL `codex_workspace_bot`（3306）；`launchd` 常驻；命令 `/help /status /cancel /stop /new /goal` |
| 模型层 | **阿里云百炼 Token Plan 个人版** + **DeepSeek-v4.1-flush** | 提供 LLM 生成能力 | 经 Codex 接入（`~/.codex/model-catalog.local.json` 声明模型）；骨碌脚本用 `codex exec -c model=...` 单次生成 |
| 应用层 | **骨碌 Workspace（gulu-app）** | 产品本体：人设、Skill、知识、脚本 | `workspace/`（**只读**，随版本发布）+ `user/`（**每用户可写**）；`AGENTS.md` 定义身份与边界 |
| 状态 / 记忆层 | UserDir（每「使用群」独立） | 绑定人格、关系阶段、互动计数、停点、定时任务回执 | `state.md` + `timeline.jsonl` / `shared_events.jsonl` / `life_events.jsonl` / 画像与话题索引；**用户实例数据不进发布包** |
| 定时任务层 | Global `schedule` 能力 | 主动触达 / 记忆整理 / 生活编造 | 由运行态 Agent 用**动态工具 `schedule.create`** 创建（interval / cron）；投递 `silent`，门禁通过时 Agent 显式发一条 |

> 完整的九节架构说明（分层细节、模型接入、状态隔离、部署形态、数据流、边界红线、版本配置）见 [整体架构.md](整体架构.md)。

---

## 三、文档路由

### 🧭 起点与总览

| 文档 | 内容 |
| --- | --- |
| [整体架构.md](整体架构.md) | 系统总览、分层职责、模型接入、部署形态、边界红线 |
| [路演html报告.md](路演html报告.md) | 路演报告（Demo + Detect 汇总）入口 |

### 🔍 1 · Discover｜发现

| 文档 | 内容 |
| --- | --- |
| [1.市场竞品调研.md](1.Discover/1.市场竞品调研.md) | 竞品格局与差异化机会 |
| [2.用户调研.md](1.Discover/2.用户调研.md) | 用户访谈与需求提炼 |
| [3.定位与定价商业假设.md](1.Discover/3.定位与定价商业假设.md) | 定位、付费点与商业假设 |
| [4.技术可行性分析.md](1.Discover/4.技术可行性分析.md) | 技术路线可行性 |
| [5.容错分析.md](1.Discover/5.容错分析.md) | 失败模式与容错设计 |
| [6.ROI分析.md](1.Discover/6.ROI分析.md) | 投入产出测算 |
| [7.合规安全分析.md](1.Discover/7.合规安全分析.md) | 合规、内容安全与隐私边界 |
| [用户问卷.md](1.Discover/用户问卷.md) | 问卷原文与投放设计 |

### 🎯 2 · Define｜定义

| 文档 | 内容 |
| --- | --- |
| [Define Overview.md](2.Define/Define%20Overview.md) | 核心问题、MVP 范围、价值闭环、责任边界 |

### 🎨 3 · Design｜设计

| 文档 | 内容 |
| --- | --- |
| [M1 Use Case.md](3.Design/M1%20Use%20Case.md) | 用例与场景定义 |
| [M2 交互响应规格.md](3.Design/M2%20交互响应规格.md) | 交互与响应规格 |
| [M3 可点击原型.md](3.Design/M3%20可点击原型.md) | 可点击原型 |
| [M4 定义能力规格.md](3.Design/M4%20定义能力规格.md) | 能力规格定义 |
| [M5 产品评测.md](3.Design/M5%20产品评测.md) | 产品评测方案 |
| [M6 PRD V1.0.md](3.Design/M6%20PRD%20V1.0.md) | PRD 正式档 |

### 🧪 4 · Demo｜实现

| 文档 | 内容 |
| --- | --- |
| [1、Ground Truth.md](4.Demo/1、Ground%20Truth.md) | 标准答案集 |
| [2、目录记忆与知识底座完整设计（v6.3）.md](4.Demo/2、目录记忆与知识底座完整设计（v6.3）.md) | 记忆与知识底座设计基线（v6.3） |
| [3、Bad Case 记录.md](4.Demo/3、Bad%20Case%20记录.md) | 失败案例归档 |
| [4、最终demo版本.md](4.Demo/4、最终demo版本.md) | 最终 Demo 版本说明 |

### 📊 5 · Detect｜评测

| 文档 | 内容 |
| --- | --- |
| [1、骨碌 GT_Oracle 题集 v3.md](5.Detect/1、骨碌%20GT_Oracle%20题集%20v3（重排版：AC-01~26%20+%20Journey%201~5）.md) | GT / Oracle 题集（AC-01~26 + Journey 1~5） |
| [2、被测对象和评测标准.md](5.Detect/2、被测对象和评测标准.md) | 被测对象与评测标准 |
| [3、执行方案.md](5.Detect/3、执行方案.md) | 评测执行方案 |
| [4、评测集.md](5.Detect/4、评测集.md) | 评测数据集 |
| [5、待打分结果集.md](5.Detect/5、待打分结果集.md) | 待打分结果 |
| [6、评分维度与标尺.md](5.Detect/6、评分维度与标尺.md) | 评分维度与标尺 |
| [7、评测报告html版.md](5.Detect/7、评测报告html版.md) | 评测报告（HTML 版）入口 |

---

## 四、推荐阅读顺序

```text
整体架构 → 1.Discover → 2.Define → 3.Design → 4.Demo → 5.Detect
 系统怎么跑    为什么做      做什么     长什么样     怎么实现    效果如何
```

---

