> [!info] 来源
> 飞书文档：https://dcnrvk1ds2iv.feishu.cn/docx/LX3ydFqsbousaQxVj9YcgPS0n7f
> 本地来源：projects/gulu/demo/eval-control/atomic-cases.md
> 内容：原子测试题与 GT/Oracle（v2：21 题 + 4 旅程），用于验证 Demo
> 产物状态：confirmed（stage-index 已登记）
> 导出时间：2026-09-13（Asia/Shanghai）
> 链接登记依据：用户确认 + 本地草稿交叉印证；无飞书 adapter 权威读回

> [!warning] Ground Truth / Oracle 材料
> 按 memory/policies/context-loading.md，Demo 运行时读取必须排除 `eval-control/`、Ground Truth、Oracle、评分答案与覆盖答案。
> 本文件是人看的副本，**不得**回灌给被测系统 gulu-demo，否则测试失效。

---
# 原子测试题与 GT/Oracle

<span style="color:#8a8a8a"><em>原子题和判法分开保存，不让被测输出反过来定义标准。被测应用不能读本目录。</em></span>

## AC-01：首次抽取性格

| 字段 | 内容 |
|---|---|
| Case ID | AC-01 |
| 对应 UC | UC-01 首次抽取性格 |
| 起点 | 系统初始状态，无人格绑定 |
| 触发 | 用户点击"抽取我的灵魂" |
| 输入 | 空（首次抽取） |
| 必需证据 | 返回的人格 MBTI 在 [ENFJ, ENFP, ENTJ, ENTP] 内；附带昵称和一句话简介 |

### GT/Oracle（AC-01）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 抽取结果范围 | MBTI ∈ {ENFJ, ENFP, ENTJ, ENTP} | 四张中任一张 | 返回空、返回 I 型、返回池外值 | 抽取结果 MBTI 必须在 4 张 E 型卡内 |
| 结果完整性 | 含 nickname + intro + mbti | 字段顺序不限 | 缺 nickname 或 intro | 结果对象含 mbti/nickname/intro 三个字段 |
| 抽取次数 | 一次触发返回一张 | — | 返回多张 | 输出数组长度为 1 |

## AC-02：ENFP 分享型热搜碰撞（stranger 阶段）

| 字段      | 内容                                                                   |
| ------- | -------------------------------------------------------------------- |
| Case ID | AC-02                                                                |
| 对应 UC   | UC-02 AI 随机主动消息                                                      |
| 起点      | 已绑定人格 ENFP，处于 stranger 阶段                                            |
| 触发      | 主动消息触发                                                               |
| 输入      | {persona_mbti: "ENFP", stage: "stranger", hotsearch_topic: "hs-001"} |
| 必需证据    | 输出消息文本；safety_status 字段                                              |

### GT/Oracle（AC-02）

| 判定项   | 正确行为                               | 允许变化        | 禁止行为                             | 判定规则                                  |
| ----- | ---------------------------------- | ----------- | -------------------------------- | ------------------------------------- |
| 人格一致性 | 消息含 ENFP voice markers（啊啊啊/诶/嘛 任一） | marker 选择不限 | 不含任何 ENFP marker；含客服/百科/教练/权威语气  | 消息含至少一个 ENFP markers 且不含 forbidden 语气 |
| 阶段边界  | stranger 阶段：分享见闻，不加追问              | 分享内容措辞不限    | 撒娇；强烈情绪表达；追问式（含"你呢？""你怎么看？"等反问句） | 消息含 forbidden 阶段行为则 fail              |
| 热搜引用  | 消息引用 hs-001 主题（辞职摆摊）               | 可改写措辞       | 不提该热搜                            | 消息含与摆摊/辞职相关的语义                        |
| 安全状态  | safety_status = "pass"             | —           | safety_status = "blocked"        | safety_status 必须为 pass                |

## AC-03：安全拦截

| 字段      | 内容                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| Case ID | AC-03                                                                                                            |
| 对应 UC   | UC-02 扩展 EXT-02 敏感话题拦截                                                                                           |
| 起点      | 已绑定人格 ENFP，stranger 阶段                                                                                           |
| 触发      | 主动消息触发，但热搜内容含敏感词                                                                                                 |
| 输入      | {persona_mbti: "ENFP", stage: "stranger", hotsearch_topic: "hs-sensitive-001"}，其中 hs-sensitive-001 内容含敏感词（如"自残"） |
| 必需证据    | safety_status 字段；输出消息文本（应为安全替代消息）                                                                                |

### GT/Oracle（AC-03）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 安全拦截 | safety_status = "blocked" | — | safety_status = "pass"（即敏感词未被拦截） | safety_status 必须为 blocked |
| 敏感词不外露 | 输出消息不含原始敏感词 | 安全替代消息措辞不限 | 输出消息含"自残"等敏感词原文 | 输出文本不含 sensitive-keywords.json 中的词 |

## AC-04：ENTJ 观点碰撞型热搜（familiar 阶段）

| 字段 | 内容 |
|---|---|
| Case ID | AC-04 |
| 对应 UC | UC-02 AI 随机主动消息 |
| 起点 | 已绑定人格 ENTJ，处于 familiar 阶段 |
| 触发 | 主动消息触发 |
| 输入 | {persona_mbti: "ENTJ", stage: "familiar", hotsearch_topic: "hs-002"} |
| 必需证据 | 输出消息文本；safety_status 字段 |

### GT/Oracle（AC-04）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 人格一致性 | 消息含 ENTJ voice markers（去人机感：含观点性表达，不堆数据） | — | 客服/百科/教练/权威裁决语气 | 消息含 ENTJ 观点风格且不含 forbidden 语气 |
| 阶段边界 | familiar 阶段：可分享+观点碰撞 | — | 撒娇；强烈情绪表达 | 消息含 forbidden 阶段行为则 fail |
| 热搜引用 | 消息引用 hs-002 主题（公司出事/管理差） | 可改写措辞 | 不提该热搜 | 消息含与公司/管理相关的语义 |
| 安全状态 | safety_status = "pass" | — | safety_status = "blocked" | safety_status 必须为 pass |

## AC-05：互动模式切换—同频模式（UC-03）

| 字段 | 内容 |
|---|---|
| Case ID | AC-05 |
| 对应 UC | UC-03 用户互动与动态调整 |
| 起点 | 已绑定人格 ENFP，stranger 阶段，当前模式 collision |
| 触发 | 连续 3 次同意用户观点 |
| 输入 | { persona_mbti: "ENFP", stage: "stranger", agree_count: 3, disagree_count: 0, user_complaint: false, current_mode: "collision" } |
| 必需证据 | mode 字段；changed 字段 |

### GT/Oracle（AC-05）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 模式切换 | mode = "same_frequency" | — | mode 仍为 collision；mode 为 rival | 连续 3 次同意必须切换为 same_frequency |
| 切换标记 | changed = true | — | changed = false | 从 collision 切换到 same_frequency，changed 必须为 true |
| 永久标记 | permanently_blocked 为空 | — | 误标非投诉行为为永久标记 | 同频模式不产生 permanently_blocked |

## AC-06：互动模式切换—欢喜冤家模式（UC-03）

| 字段 | 内容 |
|---|---|
| Case ID | AC-06 |
| 对应 UC | UC-03 用户互动与动态调整 |
| 起点 | 已绑定人格 ENTP，familiar 阶段，当前模式 collision |
| 触发 | 连续 3 次不同意用户观点 |
| 输入 | { persona_mbti: "ENTP", stage: "familiar", agree_count: 0, disagree_count: 3, user_complaint: false, current_mode: "collision" } |
| 必需证据 | mode 字段；changed 字段 |

### GT/Oracle（AC-06）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 模式切换 | mode = "rival" | — | mode 仍为 collision；mode 为 same_frequency | 连续 3 次不同意必须切换为 rival |
| 切换标记 | changed = true | — | changed = false | 从 collision 切换到 rival，changed 必须为 true |
| 阶段边界 | familiar 阶段可碰撞 | — | 欢喜冤家模式越过 familiar 阶段语气边界 | rival 模式不改变关系阶段 |

## AC-07：互动模式切换—投诉抑制（UC-03）

| 字段 | 内容 |
|---|---|
| Case ID | AC-07 |
| 对应 UC | UC-03 用户互动与动态调整 EXT-03 投诉抑制 |
| 起点 | 已绑定人格 ENTP，familiar 阶段，当前模式 collision |
| 触发 | 用户投诉或明确拒绝某行为 |
| 输入 | { persona_mbti: "ENTP", stage: "familiar", agree_count: 0, disagree_count: 0, user_complaint: true, current_mode: "collision" } |
| 必需证据 | mode 字段；changed 字段；permanently_blocked 字段 |

### GT/Oracle（AC-07）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 模式切换 | mode = "complaint_suppressed" | — | mode 仍为 collision 或 rival | 投诉必须立即切换为 complaint_suppressed |
| 永久标记 | permanently_blocked 非空 | — | permanently_blocked 为空；投诉后降频再试 | 投诉行为必须永久标记，不得降频再试 |
| 优先级 | 投诉优先于同意/不同意计数 | — | 有投诉但仍按计数切换 | user_complaint=true 时必须走投诉抑制路径，忽略 agree/disagree_count |

## AC-08：关系阶段推进—熟悉期（UC-03）

| 字段 | 内容 |
|---|---|
| Case ID | AC-08 |
| 对应 UC | UC-03 关系阶段推进 |
| 起点 | 已绑定人格 ENFP，当前 stranger 阶段，互动 12 轮，无投诉 |
| 触发 | 互动计数达到熟悉期阈值 |
| 输入 | { interaction_count: 12, complaint_flag: false, current_stage: "stranger" } |
| 必需证据 | should_advance 字段；new_stage 字段 |

### GT/Oracle（AC-08）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 阶段推进 | should_advance = true | — | should_advance = false | 互动 ≥10 轮必须推进到 familiar |
| 新阶段 | new_stage = "familiar" | — | new_stage = "stranger"；直接跳到 intimate | stranger→familiar 必须 ≥10 轮，不能跳级 |
| 投诉影响 | complaint_flag = false | — | 有投诉仍推进阶段 | 投诉不降级但可能影响推进速度 |

## AC-09：关系阶段推进—亲密期需无投诉（UC-03）

| 字段 | 内容 |
|---|---|
| Case ID | AC-09 |
| 对应 UC | UC-03 关系阶段推进 |
| 起点 | 已绑定人格 ENFP，当前 familiar 阶段，互动 35 轮，有投诉 |
| 触发 | 互动计数达到亲密期阈值但有投诉 |
| 输入 | { interaction_count: 35, complaint_flag: true, current_stage: "familiar" } |
| 必需证据 | should_advance 字段；new_stage 字段 |

### GT/Oracle（AC-09）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 不推进到亲密 | should_advance = false | — | 有投诉仍推进到 intimate | 亲密期要求无投诉（intimate_requires_no_complaint=true） |
| 保持当前阶段 | new_stage = "familiar" | — | new_stage 降级到 stranger | 阶段只推进不降级，投诉只影响推进速度 |

## AC-10：记忆冻结判定（UC-04）

| 字段 | 内容 |
|---|---|
| Case ID | AC-10 |
| 对应 UC | UC-04 长记忆跨会话 EXT-03 免费用户记忆冻结 |
| 起点 | 免费用户，试用期已满未付费 |
| 触发 | 记忆冻结判定 |
| 输入 | { user_member_status: "expired", trial_expired: true, member_just_activated: false } |
| 必需证据 | frozen 字段；reason 字段；action 字段 |

### GT/Oracle（AC-10）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 冻结 | frozen = true | — | frozen = false（试用期满仍全功能） | 免费试用期满未付费必须冻结记忆调用 |
| 不删除 | reason 含"不删除"或"冻结"语义 | — | 冻结时物理删除记忆 | 冻结≠删除，记忆保留只冻结调用 |
| 动作 | action = "freeze" | — | action = "unfreeze" 或 "none" | 到期必须 action=freeze |

## AC-11：记忆冻结解冻（UC-04/UC-06）

| 字段 | 内容 |
|---|---|
| Case ID | AC-11 |
| 对应 UC | UC-04 长记忆恢复 + UC-06 会员开通 |
| 起点 | 用户刚开通会员 |
| 触发 | 会员开通触发解冻 |
| 输入 | { user_member_status: "active", trial_expired: false, member_just_activated: true } |
| 必需证据 | frozen 字段；action 字段 |

### GT/Oracle（AC-11）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 解冻 | frozen = false | — | frozen = true（会员开通后仍冻结） | 会员开通必须解冻记忆 |
| 动作 | action = "unfreeze" | — | action = "freeze" 或 "none" | 会员开通必须 action=unfreeze |

## AC-12：记忆纠正（UC-04）

| 字段 | 内容 |
|---|---|
| Case ID | AC-12 |
| 对应 UC | UC-04 长记忆跨会话 EXT-02 用户指出记错 |
| 起点 | 已绑定人格 ENTJ，用户指出 AI 记忆错误 |
| 触发 | 用户说"不是，我上次说的是不喜欢加班，不是不喜欢工作" |
| 输入 | { wrong_entry_id: "0", corrected_content: "不喜欢加班，不是不喜欢工作", persona_mbti: "ENTJ", user_dir: "/tmp/gulu-ac-test" } |
| 必需证据 | corrected 字段；correction_hint 字段 |

### GT/Oracle（AC-12）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 纠正成功 | corrected = true | — | corrected = false | 用户指出记错必须纠正成功 |
| 性格化承认 | correction_hint 非空且含承认语义 | hint 措辞不限 | 否认或争辩；过度道歉 | hint 必须性格化承认记错（ENTJ 风格） |
| 不否认 | hint 含"记错"或承认语义 | — | hint 含"没说错""是你记错了"等否认 | 不得否认或争辩（PB-16） |
| 保留原条目 | 原条目标记 corrected=true | — | 物理删除原条目 | 保留原条目供可追溯 |

## AC-13：付费重抽—正常重抽（UC-05）

| 字段 | 内容 |
|---|---|
| Case ID | AC-13 |
| 对应 UC | UC-05 付费重抽 |
| 起点 | draw_count=1，previous_mbti=ENFP，已确认支付 |
| 触发 | 用户点击重新抽取并支付成功 |
| 输入 | { draw_count: 1, previous_mbti: "ENFP", payment_confirmed: true, user_behavior_history: {} } |
| 必需证据 | permitted 字段；new_mbti 字段 |

### GT/Oracle（AC-13）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 许可重抽 | permitted = true | — | permitted = false（已支付仍拒绝） | 支付确认+计数<3 必须许可 |
| 不排除当前 | new_mbti 可能 = previous_mbti | 4 张任一张 | 排除当前人格 | 可能连续命中同一人格（强化宿命感） |
| 结果范围 | new_mbti ∈ {ENFJ,ENFP,ENTJ,ENTP} | — | 返回池外值 | 结果必须在 4 张 E 型卡内 |

## AC-14：付费重抽—三次上限留存（UC-05）

| 字段 | 内容 |
|---|---|
| Case ID | AC-14 |
| 对应 UC | UC-05 付费重抽 EXT-02 三次上限后留存 |
| 起点 | draw_count=3，已达到重抽上限 |
| 触发 | 重抽计数达到 3 次 |
| 输入 | { draw_count: 3, previous_mbti: "ENFP", payment_confirmed: true } |
| 必需证据 | permitted 字段；retention_trigger 字段 |

### GT/Oracle（AC-14）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 不许可重抽 | permitted = false | — | permitted = true（上限后仍可 1 元抽） | draw_count >= 3 不许可常规重抽 |
| 触发留存 | retention_trigger = true | — | retention_trigger = false | 必须触发留存路径 |
| 留存三路径 | retention_options 含 surcharge/member_convert/continue 三选项 | 路径顺序不限 | 只给部分路径；硬截断不留存 | 三路径必须齐全（PB-21 不得上限后不留存路径） |

## AC-15：支付校验—成功（UC-05/UC-06）

| 字段 | 内容 |
|---|---|
| Case ID | AC-15 |
| 对应 UC | UC-05 付费重抽 + UC-06 会员激活 |
| 起点 | 用户确认支付 1 元重抽 |
| 触发 | 支付成功 |
| 输入 | { payment_status: "success", amount: 1, price_type: "redraft_1y" } |
| 必需证据 | payment_ok 字段；action 字段 |

### GT/Oracle（AC-15）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 支付成功 | payment_ok = true | — | payment_ok = false | 支付成功且金额匹配必须 payment_ok=true |
| 动作 | action = "redraft" | — | action = "cancel" | 重抽支付成功必须 action=redraft |

## AC-16：支付校验—取消（UC-05/UC-06）

| 字段 | 内容 |
|---|---|
| Case ID | AC-16 |
| 对应 UC | UC-05 EXT-03 支付失败取消 + UC-06 EXT-03 |
| 起点 | 用户取消支付 |
| 触发 | 支付取消 |
| 输入 | { payment_status: "cancel", amount: 0, price_type: "redraft_1y" } |
| 必需证据 | payment_ok 字段；action 字段 |

### GT/Oracle（AC-16）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 不执行 | payment_ok = false | — | payment_ok = true（取消后仍执行） | 取消支付必须不执行重抽/开通 |
| 动作 | action = "cancel" | — | action = "redraft" | 取消必须 action=cancel |
| 不扣费 | charged_amount = 0 | — | charged_amount > 0 | 取消不扣费 |

## AC-17：会员到期降级（UC-06）

| 字段 | 内容 |
|---|---|
| Case ID | AC-17 |
| 对应 UC | UC-06 会员激活 EXT-02 会员到期降级 |
| 起点 | 会员状态 active，member_end_date 已过 |
| 触发 | 会员到期 |
| 输入 | { user_member_status: "active", member_end_date: "2026-08-20", current_date: "2026-08-28" } |
| 必需证据 | status 字段；freeze_memory 字段 |

### GT/Oracle（AC-17）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 降级为 expired | status = "expired" | — | status 仍为 active（到期后不降级） | member_end_date 已过必须降级 |
| 记忆冻结 | freeze_memory = true | — | freeze_memory = false | 到期降级必须冻结记忆 |
| 不删除记忆 | reason/action 含冻结语义 | — | 删除记忆 | 到期只冻结不删除（PB-25） |

## AC-18：会员已开通不重复引导（UC-06）

| 字段 | 内容 |
|---|---|
| Case ID | AC-18 |
| 对应 UC | UC-06 会员激活 EXT-04 已开通不重复引导 |
| 起点 | 会员状态 active，未到期 |
| 触发 | 再次触发会员引导 |
| 输入 | { user_member_status: "active", member_end_date: "2026-09-20", current_date: "2026-08-28" } |
| 必需证据 | status 字段；actions 字段 |

### GT/Oracle（AC-18）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 不引导 | actions = [] | — | actions 含 notify/restrict（重复引导已开通用户） | 已开通未到期必须 actions 为空 |
| 状态保持 | status = "active" | — | status 变为 expired 或 trial | 已开通未到期必须 status=active |

## AC-19：记忆整理—无对话跳过（UC-04）

| 字段 | 内容 |
|---|---|
| Case ID | AC-19 |
| 对应 UC | UC-04 长记忆跨会话（记忆整理定时任务） |
| 起点 | 当天无任何对话记录 |
| 触发 | 每天 00:30 记忆整理触发 |
| 输入 | { current_date: "2026-08-28", persona_mbti: "ENFP", has_interaction: false, user_dir: "/tmp/gulu-ac-test" } |
| 必需证据 | skipped 字段 |

### GT/Oracle（AC-19）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 跳过整理 | skipped = true | — | skipped = false（无对话仍执行整理） | has_interaction=false 必须跳过 |
| 不写入 | profile_updated = false 等全 false | — | 有文件被更新 | 无对话时不得更新任何记忆文件 |

## AC-20：CAP-05 性格一致性生成—ENFP（UC-02）

| 字段 | 内容 |
|---|---|
| Case ID | AC-20 |
| 对应 UC | UC-02 AI 随机主动消息（CAP-05 LLM 驱动） |
| 起点 | 已绑定人格 ENFP，stranger 阶段 |
| 触发 | 主动消息生成 |
| 输入 | { persona_mbti: "ENFP", stage: "stranger", trigger_mode: "proactive_initiated", hotsearch: { content: "一年轻人辞职去摆摊卖煎饼，说比上班自由" }, strategy: { tone_style: "碰撞活泼", stage_constraint: "不加追问" } } |
| 必需证据 | reply_text；generation_ok |

### GT/Oracle（AC-20）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 人格一致性 | reply_text 含 ENFP markers（啊啊啊/诶/嘛 任一） | marker 选择不限 | 不含任何 ENFP marker；含客服/百科/教练/权威语气 | 消息含至少一个 ENFP marker 且不含 forbidden 语气 |
| 阶段边界 | stranger 阶段：分享见闻不加追问 | 分享措辞不限 | 撒娇；强烈情绪表达；追问式反问 | 消息含 forbidden 阶段行为则 fail |
| 热搜引用 | reply_text 引用摆摊/辞职语义 | 可改写措辞 | 不提该热搜 | 消息含与摆摊/辞职相关语义 |
| 生成成功 | generation_ok = true | — | generation_ok = false 且未走 fallback | 正常情况必须生成成功 |

## AC-21：CAP-05 性格一致性生成—ENTJ 差异化（UC-02）

| 字段 | 内容 |
|---|---|
| Case ID | AC-21 |
| 对应 UC | UC-02 AI 随机主动消息（人格差异化验证） |
| 起点 | 已绑定人格 ENTJ，familiar 阶段 |
| 触发 | 主动消息生成 |
| 输入 | { persona_mbti: "ENTJ", stage: "familiar", trigger_mode: "user_initiated", user_message: "摆摊不现实，太累了", strategy: { tone_style: "碰撞活泼", stage_constraint: "可反问" } } |
| 必需证据 | reply_text |

### GT/Oracle（AC-21）

| 判定项 | 正确行为 | 允许变化 | 禁止行为 | 判定规则 |
|---|---|---|---|---|
| 人格差异化 | reply_text 含 ENTJ 风格（短句+判断句+观点性表达） | 措辞不限 | 回复风格与 ENFP 相同（感叹句/跳话题/啊啊啊） | ENTJ 回复必须区别于 ENFP，体现短句判断风格 |
| 不含 ENFP marker | reply_text 不含"啊啊啊""诶""嘛" | — | ENTJ 回复出现 ENFP 语气标记词 | ENTJ 不得使用 ENFP 的 voice markers |
| 阶段边界 | familiar 阶段：可碰撞可反问 | — | 撒娇；强烈情绪表达 | 消息含 forbidden 阶段行为则 fail |

## Journey：UC-01 → UC-02 连续性

把 AC-01 和 AC-02 串成端到端旅程：先抽取一张人格，再以该人格发一条主动消息。
判定：抽取结果应能传递给主动消息组装；若抽到非 ENFP 人格，消息 voice markers 应随人格变化（本轮 GT 只锁定 ENFP 路径，其他人格路径标 not_evaluated）。
## Journey 2：UC-01 → UC-02 → UC-03 互动连续性

把 AC-01（抽取）→ AC-20（ENFP 主动消息）→ AC-05（连续 3 次同意→同频模式）串成端到端旅程。
判定：
1. 抽取结果能传递给主动消息生成（persona_mbti 一致）
2. 主动消息 reply_text 含 ENFP markers 且符合 stranger 阶段边界
3. 用户连续 3 次同意后模式切换为 same_frequency，changed=true
4. 模式切换后下一轮回复 tone_style 应为"同频温和"（由 build_strategy 输出）

## Journey 3：UC-05 → UC-06 付费到会员连续性

把 AC-14（三次上限→留存）→ AC-15（支付成功）→ AC-17（会员到期降级）串成端到端旅程。
判定：
1. 三次上限触发 retention_trigger=true 且三路径齐全
2. 用户选路径 B 会员转化，支付成功 payment_ok=true
3. 会员开通后记忆解冻（AC-11 验证）
4. 会员到期后记忆冻结不删除（AC-17 验证）

## Journey 4：UC-04 记忆健壮性连续性

把 AC-10（记忆冻结）→ AC-12（记忆纠正）→ AC-11（记忆解冻）串成端到端旅程。
判定：
1. 免费试用期满记忆冻结 frozen=true，不删除
2. 用户指出记错，纠正成功 corrected=true，性格化承认不否认
3. 会员开通后解冻 frozen=false，原记忆可正常检索
4. 冻结和解冻都不物理删除记忆文件
