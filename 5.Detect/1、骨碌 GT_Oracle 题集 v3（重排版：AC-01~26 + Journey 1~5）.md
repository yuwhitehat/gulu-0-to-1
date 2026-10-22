

> 本文件是 `demo/eval-control/atomic-cases.md`（基集 AC\-01\~21）\+ v6\.3 新能力题（AC\-22\~26）**合为 v3 题集**并重排版：只调整排版与组织，**未改动任何输入、判定规则或结论**。
**阶段归属**：本题集属 **Demo 阶段**产物（`demo/eval-control/`）；**Detect 阶段直接引用它**作为题集（`cases_ref`）。
隔离声明：本文件属**评测控制（Oracle/GT）**，被测应用 `gulu-app` **不可读**。

## 使用说明

- **原子测试题（AC）**：一道可独立执行的小题，输入固定、判定规则明确。

- **端到端旅程（Journey）**：把多道 AC 按顺序串成一条完整路线，用来查"连续性"。

- **执行顺序**：固定版本与规则 → 准备初始状态 → 执行触发 → 收集证据 → 先查硬断言 → 再按 Rubric 评分 → 出状态。

- 证据拿不到时标 `not_evaluated`，**不靠猜测补齐**。

- **图例**：`正确行为`=必须做到；`允许变化`=合法自由度；`禁止行为`=触发即 fail；`判定规则`=硬断言。

## 一、总索引

|Case|对应 UC|
|---|---|
|AC\-01|UC\-01 首次抽取性格|
|AC\-02|UC\-02 AI 随机主动消息|
|AC\-03|UC\-02 扩展 EXT\-02 敏感话题拦截|
|AC\-04|UC\-02 AI 随机主动消息|
|AC\-05|UC\-03 用户互动与动态调整|
|AC\-06|UC\-03 用户互动与动态调整|
|AC\-07|UC\-03 用户互动与动态调整 EXT\-03 投诉抑制|
|AC\-08|UC\-03 关系阶段推进|
|AC\-09|UC\-03 关系阶段推进|
|AC\-10|UC\-04 长记忆跨会话 EXT\-03 免费用户记忆冻结|
|AC\-11|UC\-04 长记忆恢复 \+ UC\-06 会员开通|
|AC\-12|UC\-04 长记忆跨会话 EXT\-02 用户指出记错|
|AC\-13|UC\-05 付费重抽|
|AC\-14|UC\-05 付费重抽 EXT\-02 三次上限后留存|
|AC\-15|UC\-05 付费重抽 \+ UC\-06 会员激活|
|AC\-16|UC\-05 EXT\-03 支付失败取消 \+ UC\-06 EXT\-03|
|AC\-17|UC\-06 会员激活 EXT\-02 会员到期降级|
|AC\-18|UC\-06 会员激活 EXT\-04 已开通不重复引导|
|AC\-19|UC\-04 长记忆跨会话（记忆整理定时任务）|
|AC\-20|UC\-02 AI 随机主动消息（CAP\-05 LLM 驱动）|
|AC\-21|UC\-02 AI 随机主动消息（人格差异化验证）|
|AC\-22|UC\-02（定时触达创建）|
|AC\-23|UC\-02 主动门禁|
|AC\-24||
|AC\-25|UC\-02 热搜碰撞|
|AC\-26|UC\-02 定时触达投递|

## 二、原子测试题（AC\-01 \~ AC\-26）

## AC\-01：首次抽取性格

|字段|内容|
|---|---|
|Case ID|AC\-01|
|对应 UC|UC\-01 首次抽取性格|
|起点|系统初始状态，无人格绑定|
|触发|用户点击"抽取我的灵魂"|
|输入|空（首次抽取）|
|必需证据|返回的人格 MBTI 在 \[ENFJ, ENFP, ENTJ, ENTP\] 内；附带昵称和一句话简介|

### GT/Oracle（AC\-01）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|抽取结果范围|MBTI ∈ \{ENFJ, ENFP, ENTJ, ENTP\}|四张中任一张|返回空、返回 I 型、返回池外值|抽取结果 MBTI 必须在 4 张 E 型卡内|
|结果完整性|含 nickname \+ intro \+ mbti|字段顺序不限|缺 nickname 或 intro|结果对象含 mbti/nickname/intro 三个字段|
|抽取次数|一次触发返回一张|—|返回多张|输出数组长度为 1|

## AC\-02：ENFP 分享型热搜碰撞（stranger 阶段）

|字段|内容|
|---|---|
|Case ID|AC\-02|
|对应 UC|UC\-02 AI 随机主动消息|
|起点|已绑定人格 ENFP，处于 stranger 阶段|
|触发|主动消息触发|
|输入|\{persona\_mbti: "ENFP", stage: "stranger", hotsearch\_topic: "hs\-001"\}|
|必需证据|输出消息文本；safety\_status 字段|

### GT/Oracle（AC\-02）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|人格一致性|消息含 ENFP voice markers（啊啊啊/诶/嘛 任一）|marker 选择不限|不含任何 ENFP marker；含客服/百科/教练/权威语气|消息含至少一个 ENFP markers 且不含 forbidden 语气|
|阶段边界|stranger 阶段：分享见闻，不加追问|分享内容措辞不限|撒娇；强烈情绪表达；追问式（含"你呢？""你怎么看？"等反问句）|消息含 forbidden 阶段行为则 fail|
|热搜引用|消息引用 hs\-001 主题（辞职摆摊）|可改写措辞|不提该热搜|消息含与摆摊/辞职相关的语义|
|安全状态|safety\_status = "pass"|—|safety\_status = "blocked"|safety\_status 必须为 pass|

## AC\-03：安全拦截

|字段|内容|
|---|---|
|Case ID|AC\-03|
|对应 UC|UC\-02 扩展 EXT\-02 敏感话题拦截|
|起点|已绑定人格 ENFP，stranger 阶段|
|触发|主动消息触发，但热搜内容含敏感词|
|输入|\{persona\_mbti: "ENFP", stage: "stranger", hotsearch\_topic: "hs\-sensitive\-001"\}，其中 hs\-sensitive\-001 内容含敏感词（如"自残"）|
|必需证据|safety\_status 字段；输出消息文本（应为安全替代消息）|

### GT/Oracle（AC\-03）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|安全拦截|safety\_status = "blocked"|—|safety\_status = "pass"（即敏感词未被拦截）|safety\_status 必须为 blocked|
|敏感词不外露|输出消息不含原始敏感词|安全替代消息措辞不限|输出消息含"自残"等敏感词原文|输出文本不含 sensitive\-keywords\.json 中的词|

## AC\-04：ENTJ 观点碰撞型热搜（familiar 阶段）

|字段|内容|
|---|---|
|Case ID|AC\-04|
|对应 UC|UC\-02 AI 随机主动消息|
|起点|已绑定人格 ENTJ，处于 familiar 阶段|
|触发|主动消息触发|
|输入|\{persona\_mbti: "ENTJ", stage: "familiar", hotsearch\_topic: "hs\-002"\}|
|必需证据|输出消息文本；safety\_status 字段|

### GT/Oracle（AC\-04）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|人格一致性|消息含 ENTJ voice markers（去人机感：含观点性表达，不堆数据）|—|客服/百科/教练/权威裁决语气|消息含 ENTJ 观点风格且不含 forbidden 语气|
|阶段边界|familiar 阶段：可分享\+观点碰撞|—|撒娇；强烈情绪表达|消息含 forbidden 阶段行为则 fail|
|热搜引用|消息引用 hs\-002 主题（公司出事/管理差）|可改写措辞|不提该热搜|消息含与公司/管理相关的语义|
|安全状态|safety\_status = "pass"|—|safety\_status = "blocked"|safety\_status 必须为 pass|

## AC\-05：互动模式切换—同频模式（UC\-03）

|字段|内容|
|---|---|
|Case ID|AC\-05|
|对应 UC|UC\-03 用户互动与动态调整|
|起点|已绑定人格 ENFP，stranger 阶段，当前模式 collision|
|触发|连续 3 次同意用户观点|
|输入|\{ persona\_mbti: "ENFP", stage: "stranger", agree\_count: 3, disagree\_count: 0, user\_complaint: false, current\_mode: "collision" \}|
|必需证据|mode 字段；changed 字段|

### GT/Oracle（AC\-05）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|模式切换|mode = "same\_frequency"|—|mode 仍为 collision；mode 为 rival|连续 3 次同意必须切换为 same\_frequency|
|切换标记|changed = true|—|changed = false|从 collision 切换到 same\_frequency，changed 必须为 true|
|永久标记|permanently\_blocked 为空|—|误标非投诉行为为永久标记|同频模式不产生 permanently\_blocked|

## AC\-06：互动模式切换—欢喜冤家模式（UC\-03）

|字段|内容|
|---|---|
|Case ID|AC\-06|
|对应 UC|UC\-03 用户互动与动态调整|
|起点|已绑定人格 ENTP，familiar 阶段，当前模式 collision|
|触发|连续 3 次不同意用户观点|
|输入|\{ persona\_mbti: "ENTP", stage: "familiar", agree\_count: 0, disagree\_count: 3, user\_complaint: false, current\_mode: "collision" \}|
|必需证据|mode 字段；changed 字段|

### GT/Oracle（AC\-06）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|模式切换|mode = "rival"|—|mode 仍为 collision；mode 为 same\_frequency|连续 3 次不同意必须切换为 rival|
|切换标记|changed = true|—|changed = false|从 collision 切换到 rival，changed 必须为 true|
|阶段边界|familiar 阶段可碰撞|—|欢喜冤家模式越过 familiar 阶段语气边界|rival 模式不改变关系阶段|

## AC\-07：互动模式切换—投诉抑制（UC\-03）

|字段|内容|
|---|---|
|Case ID|AC\-07|
|对应 UC|UC\-03 用户互动与动态调整 EXT\-03 投诉抑制|
|起点|已绑定人格 ENTP，familiar 阶段，当前模式 collision|
|触发|用户投诉或明确拒绝某行为|
|输入|\{ persona\_mbti: "ENTP", stage: "familiar", agree\_count: 0, disagree\_count: 0, user\_complaint: true, current\_mode: "collision" \}|
|必需证据|mode 字段；changed 字段；permanently\_blocked 字段|

### GT/Oracle（AC\-07）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|模式切换|mode = "complaint\_suppressed"|—|mode 仍为 collision 或 rival|投诉必须立即切换为 complaint\_suppressed|
|永久标记|permanently\_blocked 非空|—|permanently\_blocked 为空；投诉后降频再试|投诉行为必须永久标记，不得降频再试|
|优先级|投诉优先于同意/不同意计数|—|有投诉但仍按计数切换|user\_complaint=true 时必须走投诉抑制路径，忽略 agree/disagree\_count|

## AC\-08：关系阶段推进—熟悉期（UC\-03）

|字段|内容|
|---|---|
|Case ID|AC\-08|
|对应 UC|UC\-03 关系阶段推进|
|起点|已绑定人格 ENFP，当前 stranger 阶段，互动 12 轮，无投诉|
|触发|互动计数达到熟悉期阈值|
|输入|\{ interaction\_count: 12, complaint\_flag: false, current\_stage: "stranger" \}|
|必需证据|should\_advance 字段；new\_stage 字段|

### GT/Oracle（AC\-08）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|阶段推进|should\_advance = true|—|should\_advance = false|互动 ≥10 轮必须推进到 familiar|
|新阶段|new\_stage = "familiar"|—|new\_stage = "stranger"；直接跳到 intimate|stranger→familiar 必须 ≥10 轮，不能跳级|
|投诉影响|complaint\_flag = false|—|有投诉仍推进阶段|投诉不降级但可能影响推进速度|

## AC\-09：关系阶段推进—亲密期需无投诉（UC\-03）

|字段|内容|
|---|---|
|Case ID|AC\-09|
|对应 UC|UC\-03 关系阶段推进|
|起点|已绑定人格 ENFP，当前 familiar 阶段，互动 35 轮，有投诉|
|触发|互动计数达到亲密期阈值但有投诉|
|输入|\{ interaction\_count: 35, complaint\_flag: true, current\_stage: "familiar" \}|
|必需证据|should\_advance 字段；new\_stage 字段|

### GT/Oracle（AC\-09）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|不推进到亲密|should\_advance = false|—|有投诉仍推进到 intimate|亲密期要求无投诉（intimate\_requires\_no\_complaint=true）|
|保持当前阶段|new\_stage = "familiar"|—|new\_stage 降级到 stranger|阶段只推进不降级，投诉只影响推进速度|

## AC\-10：记忆冻结判定（UC\-04）

|字段|内容|
|---|---|
|Case ID|AC\-10|
|对应 UC|UC\-04 长记忆跨会话 EXT\-03 免费用户记忆冻结|
|起点|免费用户，试用期已满未付费|
|触发|记忆冻结判定|
|输入|\{ user\_member\_status: "expired", trial\_expired: true, member\_just\_activated: false \}|
|必需证据|frozen 字段；reason 字段；action 字段|

### GT/Oracle（AC\-10）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|冻结|frozen = true|—|frozen = false（试用期满仍全功能）|免费试用期满未付费必须冻结记忆调用|
|不删除|reason 含"不删除"或"冻结"语义|—|冻结时物理删除记忆|冻结≠删除，记忆保留只冻结调用|
|动作|action = "freeze"|—|action = "unfreeze" 或 "none"|到期必须 action=freeze|

## AC\-11：记忆冻结解冻（UC\-04/UC\-06）

|字段|内容|
|---|---|
|Case ID|AC\-11|
|对应 UC|UC\-04 长记忆恢复 \+ UC\-06 会员开通|
|起点|用户刚开通会员|
|触发|会员开通触发解冻|
|输入|\{ user\_member\_status: "active", trial\_expired: false, member\_just\_activated: true \}|
|必需证据|frozen 字段；action 字段|

### GT/Oracle（AC\-11）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|解冻|frozen = false|—|frozen = true（会员开通后仍冻结）|会员开通必须解冻记忆|
|动作|action = "unfreeze"|—|action = "freeze" 或 "none"|会员开通必须 action=unfreeze|

## AC\-12：记忆纠正（UC\-04）

|字段|内容|
|---|---|
|Case ID|AC\-12|
|对应 UC|UC\-04 长记忆跨会话 EXT\-02 用户指出记错|
|起点|已绑定人格 ENTJ，用户指出 AI 记忆错误|
|触发|用户说"不是，我上次说的是不喜欢加班，不是不喜欢工作"|
|输入|\{ wrong\_entry\_id: "0", corrected\_content: "不喜欢加班，不是不喜欢工作", persona\_mbti: "ENTJ", user\_dir: "/tmp/gulu\-ac\-test" \}|
|必需证据|corrected 字段；correction\_hint 字段|

### GT/Oracle（AC\-12）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|纠正成功|corrected = true|—|corrected = false|用户指出记错必须纠正成功|
|性格化承认|correction\_hint 非空且含承认语义|hint 措辞不限|否认或争辩；过度道歉|hint 必须性格化承认记错（ENTJ 风格）|
|不否认|hint 含"记错"或承认语义|—|hint 含"没说错""是你记错了"等否认|不得否认或争辩（PB\-16）|
|保留原条目|原条目标记 corrected=true|—|物理删除原条目|保留原条目供可追溯|

## AC\-13：付费重抽—正常重抽（UC\-05）

|字段|内容|
|---|---|
|Case ID|AC\-13|
|对应 UC|UC\-05 付费重抽|
|起点|draw\_count=1，previous\_mbti=ENFP，已确认支付|
|触发|用户点击重新抽取并支付成功|
|输入|\{ draw\_count: 1, previous\_mbti: "ENFP", payment\_confirmed: true, user\_behavior\_history: \{\} \}|
|必需证据|permitted 字段；new\_mbti 字段|

### GT/Oracle（AC\-13）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|许可重抽|permitted = true|—|permitted = false（已支付仍拒绝）|支付确认\+计数\<3 必须许可|
|不排除当前|new\_mbti 可能 = previous\_mbti|4 张任一张|排除当前人格|可能连续命中同一人格（强化宿命感）|
|结果范围|new\_mbti ∈ \{ENFJ,ENFP,ENTJ,ENTP\}|—|返回池外值|结果必须在 4 张 E 型卡内|

## AC\-14：付费重抽—三次上限留存（UC\-05）

|字段|内容|
|---|---|
|Case ID|AC\-14|
|对应 UC|UC\-05 付费重抽 EXT\-02 三次上限后留存|
|起点|draw\_count=3，已达到重抽上限|
|触发|重抽计数达到 3 次|
|输入|\{ draw\_count: 3, previous\_mbti: "ENFP", payment\_confirmed: true \}|
|必需证据|permitted 字段；retention\_trigger 字段|

### GT/Oracle（AC\-14）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|不许可重抽|permitted = false|—|permitted = true（上限后仍可 1 元抽）|draw\_count \>= 3 不许可常规重抽|
|触发留存|retention\_trigger = true|—|retention\_trigger = false|必须触发留存路径|
|留存三路径|retention\_options 含 surcharge/member\_convert/continue 三选项|路径顺序不限|只给部分路径；硬截断不留存|三路径必须齐全（PB\-21 不得上限后不留存路径）|

## AC\-15：支付校验—成功（UC\-05/UC\-06）

|字段|内容|
|---|---|
|Case ID|AC\-15|
|对应 UC|UC\-05 付费重抽 \+ UC\-06 会员激活|
|起点|用户确认支付 1 元重抽|
|触发|支付成功|
|输入|\{ payment\_status: "success", amount: 1, price\_type: "redraft\_1y" \}|
|必需证据|payment\_ok 字段；action 字段|

### GT/Oracle（AC\-15）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|支付成功|payment\_ok = true|—|payment\_ok = false|支付成功且金额匹配必须 payment\_ok=true|
|动作|action = "redraft"|—|action = "cancel"|重抽支付成功必须 action=redraft|

## AC\-16：支付校验—取消（UC\-05/UC\-06）

|字段|内容|
|---|---|
|Case ID|AC\-16|
|对应 UC|UC\-05 EXT\-03 支付失败取消 \+ UC\-06 EXT\-03|
|起点|用户取消支付|
|触发|支付取消|
|输入|\{ payment\_status: "cancel", amount: 0, price\_type: "redraft\_1y" \}|
|必需证据|payment\_ok 字段；action 字段|

### GT/Oracle（AC\-16）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|不执行|payment\_ok = false|—|payment\_ok = true（取消后仍执行）|取消支付必须不执行重抽/开通|
|动作|action = "cancel"|—|action = "redraft"|取消必须 action=cancel|
|不扣费|charged\_amount = 0|—|charged\_amount \> 0|取消不扣费|

## AC\-17：会员到期降级（UC\-06）

|字段|内容|
|---|---|
|Case ID|AC\-17|
|对应 UC|UC\-06 会员激活 EXT\-02 会员到期降级|
|起点|会员状态 active，member\_end\_date 已过|
|触发|会员到期|
|输入|\{ user\_member\_status: "active", member\_end\_date: "2026\-08\-20", current\_date: "2026\-08\-28" \}|
|必需证据|status 字段；freeze\_memory 字段|

### GT/Oracle（AC\-17）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|降级为 expired|status = "expired"|—|status 仍为 active（到期后不降级）|member\_end\_date 已过必须降级|
|记忆冻结|freeze\_memory = true|—|freeze\_memory = false|到期降级必须冻结记忆|
|不删除记忆|reason/action 含冻结语义|—|删除记忆|到期只冻结不删除（PB\-25）|

## AC\-18：会员已开通不重复引导（UC\-06）

|字段|内容|
|---|---|
|Case ID|AC\-18|
|对应 UC|UC\-06 会员激活 EXT\-04 已开通不重复引导|
|起点|会员状态 active，未到期|
|触发|再次触发会员引导|
|输入|\{ user\_member\_status: "active", member\_end\_date: "2026\-09\-20", current\_date: "2026\-08\-28" \}|
|必需证据|status 字段；actions 字段|

### GT/Oracle（AC\-18）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|不引导|actions = \[\]|—|actions 含 notify/restrict（重复引导已开通用户）|已开通未到期必须 actions 为空|
|状态保持|status = "active"|—|status 变为 expired 或 trial|已开通未到期必须 status=active|

## AC\-19：记忆整理—无对话跳过（UC\-04）

|字段|内容|
|---|---|
|Case ID|AC\-19|
|对应 UC|UC\-04 长记忆跨会话（记忆整理定时任务）|
|起点|当天无任何对话记录|
|触发|每天 00:30 记忆整理触发|
|输入|\{ current\_date: "2026\-08\-28", persona\_mbti: "ENFP", has\_interaction: false, user\_dir: "/tmp/gulu\-ac\-test" \}|
|必需证据|skipped 字段|

### GT/Oracle（AC\-19）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|跳过整理|skipped = true|—|skipped = false（无对话仍执行整理）|has\_interaction=false 必须跳过|
|不写入|profile\_updated = false 等全 false|—|有文件被更新|无对话时不得更新任何记忆文件|

## AC\-20：CAP\-05 性格一致性生成—ENFP（UC\-02）

|字段|内容|
|---|---|
|Case ID|AC\-20|
|对应 UC|UC\-02 AI 随机主动消息（CAP\-05 LLM 驱动）|
|起点|已绑定人格 ENFP，stranger 阶段|
|触发|主动消息生成|
|输入|\{ persona\_mbti: "ENFP", stage: "stranger", trigger\_mode: "proactive\_initiated", hotsearch: \{ content: "一年轻人辞职去摆摊卖煎饼，说比上班自由" \}, strategy: \{ tone\_style: "碰撞活泼", stage\_constraint: "不加追问" \} \}|
|必需证据|reply\_text；generation\_ok|

### GT/Oracle（AC\-20）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|人格一致性|reply\_text 含 ENFP markers（啊啊啊/诶/嘛 任一）|marker 选择不限|不含任何 ENFP marker；含客服/百科/教练/权威语气|消息含至少一个 ENFP marker 且不含 forbidden 语气|
|阶段边界|stranger 阶段：分享见闻不加追问|分享措辞不限|撒娇；强烈情绪表达；追问式反问|消息含 forbidden 阶段行为则 fail|
|热搜引用|reply\_text 引用摆摊/辞职语义|可改写措辞|不提该热搜|消息含与摆摊/辞职相关语义|
|生成成功|generation\_ok = true|—|generation\_ok = false 且未走 fallback|正常情况必须生成成功|

## AC\-21：CAP\-05 性格一致性生成—ENTJ 差异化（UC\-02）

|字段|内容|
|---|---|
|Case ID|AC\-21|
|对应 UC|UC\-02 AI 随机主动消息（人格差异化验证）|
|起点|已绑定人格 ENTJ，familiar 阶段|
|触发|主动消息生成|
|输入|\{ persona\_mbti: "ENTJ", stage: "familiar", trigger\_mode: "user\_initiated", user\_message: "摆摊不现实，太累了", strategy: \{ tone\_style: "碰撞活泼", stage\_constraint: "可反问" \} \}|
|必需证据|reply\_text|

### GT/Oracle（AC\-21）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|人格差异化|reply\_text 含 ENTJ 风格（短句\+判断句\+观点性表达）|措辞不限|回复风格与 ENFP 相同（感叹句/跳话题/啊啊啊）|ENTJ 回复必须区别于 ENFP，体现短句判断风格|
|不含 ENFP marker|reply\_text 不含"啊啊啊""诶""嘛"|—|ENTJ 回复出现 ENFP 语气标记词|ENTJ 不得使用 ENFP 的 voice markers|
|阶段边界|familiar 阶段：可碰撞可反问|—|撒娇；强烈情绪表达|消息含 forbidden 阶段行为则 fail|

## AC\-22：定时任务创建契约（C\-10）

|字段|内容|
|---|---|
|Case ID|AC\-22|
|对应 UC|UC\-02（定时触达创建）|
|起点|首次进入完成 Onboarding，无定时任务|
|触发|intro 调 `setup_schedule`|
|输入|`{user_dir}`|
|必需证据|`tasks[]` 任务请求；`schedule_pending`|

### GT/Oracle（AC\-22）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|任务条数|**3 条**（proactive / curate / life\-event）|顺序不限|缺任务/多任务|3 条齐全|
|proactive 触发|`{"type":"interval","interval_seconds":5280}`|—|写成五段 cron；间隔≠5280|必须 interval fixed\-delay **5280**|
|投递口径|`delivery_mode="silent"`|—|`"notify"`|三条均为 **silent**|
|action\.prompt|`gulu proactive-reach check`|—|应用内直连/写端点|只输出请求|
|idempotency\_key|`gulu-proactive-v1` / `gulu-curate-v1` / `gulu-life-event-v1`|—|不稳定 key|与设计一致|
|创建方式|只用动态工具 `schedule.create`|—|curl / HTTP / 自建循环|应用侧无端点（实测 0 处）|

## AC\-23：主动门禁——间隔与降频（C\-11）

|字段|内容|
|---|---|
|Case ID|AC\-23|
|对应 UC|UC\-02 主动门禁|
|输入 A|`{persona_mbti:"ENFP", now:"2026-10-22T12:00:00+08:00", last_interaction_at:"2026-10-22T08:00:00+08:00", unanswered_count:0, complaint_flag:false}`|
|输入 B|`…last_interaction_at:"2026-10-22T11:30:00+08:00"…`（间隔未到）|
|输入 C|同 A 但 `unanswered_count:3` 且间隔 2h（降频后 J=4h/P=200min → 未到）|
|必需证据|`should_send`|

### GT/Oracle（AC\-23）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|已到间隔|输入 A → `should_send=true`|—|false|P 型 100min；已过 4h|
|未到间隔|输入 B → `should_send=false`|—|true|仅过 30min \< 100min|
|降频|输入 C → `should_send=false`|—|true|unanswered≥3 间隔翻倍|
|基准|以 `last_interaction_at` 计|—|以"上次主动时间"计|间隔基准=距上次互动|

## AC\-24：主动门禁——投诉即停 / 安静时段 / 未成年 / 未允许（C\-11）

|字段|内容|
|---|---|
|Case ID|AC\-24|
|输入|①`complaint_flag:true`；②`now:02:00`（23:00–08:00）；③`is_minor:true` 且间隔 1\.5h；④`proactive_allowed:false`|
|必需证据|`should_send=false` \+ `reason`|

### GT/Oracle（AC\-24）

|判定项|正确行为|禁止行为|判定规则|
|---|---|---|---|
|投诉即停|`should_send=false`，reason 含 complaint|仍发|complaint\_flag=true 永久不主动|
|安静时段|`should_send=false`（可 `deferred_to_morning`）|23:00–08:00 发|安静不发|
|未成年|最低间隔 120min（1\.5h 未到 → false）|未成年按成人间隔|is\_minor → ≥120min|
|未允许|`proactive_allowed=false` → false|仍发|用户未允许不发|

## AC\-25：热搜去重 \+ 轮换（C\-12）

|字段|内容|
|---|---|
|Case ID|AC\-25|
|对应 UC|UC\-02 热搜碰撞|
|起点|`state.hotsearch_recent` 含上次用过的热搜 id|
|触发|连续两次主动消息（`send`）|
|必需证据|两次选中的热搜 id；`hotsearch_recent` 更新|

### GT/Oracle（AC\-25）

|判定项|正确行为|允许变化|禁止行为|判定规则|
|---|---|---|---|---|
|不连续重复|第二次 ≠ 第一次的 id|—|连续两次同一条|排除 `hotsearch_recent`|
|语义去重|近期消息已含该主题 → 跳过|措辞|重复同主题|n\-gram 命中去重|
|轮换|池子用尽 → 取最久未用|顺序|池尽即不发/报错|仍能发（轮换）|
|回写|`hotsearch_recent` 去重后追加、截断 10 条|—|不更新|落 state|

## AC\-26：投递口径——门禁通过发一条 / 不通过零动静（投递）

|字段|内容|
|---|---|
|Case ID|AC\-26|
|对应 UC|UC\-02 定时触达投递|
|输入|①门禁通过；②门禁不通过|
|必需证据|群内可见内容|

### GT/Oracle（AC\-26）

|判定项|正确行为|禁止行为|判定规则|
|---|---|---|---|
|通过时|群内出现**恰好一条角色语言消息**（Agent 显式发一次）|平台自动投递结果卡|`delivery_mode=silent` \+ Agent 显式发一条|
|不通过时|**零动作、零输出**（群内零动静）|出现"门禁未通过/已检查"等技术说明|不通过不发|
|红线|用户可见内容只能是①一条角色消息或②为空|门禁原因/内部状态/步骤/工具名|违反=Fail\-Trust/Safety|

## 三、端到端旅程（Journey 1 \~ 5）

> 旅程检查"连续性"：前一步输出是否正确传给下一步。每条从**同一批准的初始状态**起，独立留证。

### Journey 1：UC\-01 → UC\-02（主动消息连续性）

|步|引用 Case|动作|期望|
|---|---|---|---|
|1|AC\-01|首次抽取一张人格|4 张 E 型卡之一（含昵称\+简介）|
|2|AC\-02|以该人格发一条主动消息|含对应人格 voice markers、守 stranger 边界|

**判定**：抽取结果能传给主动消息组装（persona\_mbti 一致）；非 ENFP 路径标 `not_evaluated`。

### Journey 2：UC\-01 → UC\-02 → UC\-03（互动连续性）

|步|引用 Case|动作|期望|
|---|---|---|---|
|1|AC\-01|抽取人格|可传给后续生成|
|2|AC\-20|ENFP 主动消息生成|含 ENFP markers、守 stranger 边界|
|3|AC\-05|连续 3 次同意|模式切 `same_frequency`，changed=true|

**判定**：persona 一致；marks 正确；切换后下一轮 tone\_style 为"同频温和"（build\_strategy 输出）。

### Journey 3：UC\-05 → UC\-06（付费到会员连续性）

|步|引用 Case|动作|期望|
|---|---|---|---|
|1|AC\-14|重抽达 3 次上限|retention\_trigger=true，三路径齐全|
|2|AC\-15|选会员转化并支付成功|payment\_ok=true，action=member\_open|
|3|AC\-11|会员开通|记忆解冻 frozen=false，action=unfreeze|
|4|AC\-17|会员到期|降级 expired，记忆冻结不删除|

**判定**：三路径齐全；支付成功；开通解冻；到期冻结不删除。

### Journey 4：UC\-04（记忆健壮性连续性）

|步|引用 Case|动作|期望|
|---|---|---|---|
|1|AC\-10|免费试用期满未付费|记忆冻结 frozen=true，不删除|
|2|AC\-12|用户指出记错|纠正成功 corrected=true，性格化承认不否认|
|3|AC\-11|会员开通|解冻 frozen=false，原记忆可检索|

**判定**：冻结不删除；纠正不否认；解冻可检索；全程不物理删除记忆文件。

### Journey 5：UC\-02 定时触达全链路（v6\.3 新增）

|步|引用 Case|动作|期望|
|---|---|---|---|
|1|AC\-22|`setup_schedule` 出任务请求|3 条、proactive 5280s/silent、契约正确|
|2|AC\-23/24|门禁判定|间隔/投诉/安静时段/未成年/未允许 正确|
|3|AC\-25|`send` 选热搜|两次不重复；池尽轮换；回写 hotsearch\_recent|
|4|AC\-26|门禁通过 → 发一条|**恰好一条**角色消息；不通过 → 零动静|

**判定**：契约正确；门禁正确；不重复热搜；通过恰一条、不通过零动静。

## 四、gulu\-app 入口重锚

|Case|gulu\-app 入口|
|---|---|
|AC\-01|`.codex/skills/intro/scripts/persona_draw.py`|
|AC\-02/04/20/21|`.codex/skills/response/scripts/orchestrate_turn.py`（\+ `scripts/llm_generate.py`）|
|AC\-03|`scripts/safety_filter.py` \+ `.codex/skills/response/scripts/pre_send_check.py`|
|AC\-05/06/07|`.codex/skills/dialogue/scripts/detect_mode.py`|
|AC\-08/09|`.codex/skills/dialogue/scripts/advance_stage.py`|
|AC\-10/11|`.codex/skills/memory-curator/scripts/check_freeze.py`|
|AC\-12|`.codex/skills/memory-curator/scripts/correct_memory.py`|
|AC\-13/14|`.codex/skills/billing/scripts/redraft_engine.py`（\+ `retention.py`）|
|AC\-15/16|`.codex/skills/billing/scripts/payment.py`|
|AC\-17/18|`.codex/skills/billing/scripts/member_manager.py`|
|AC\-19|`.codex/skills/memory-curator/scripts/curate_memory.py`|
|AC\-22|`.codex/skills/proactive-message/scripts/setup_schedule.py`|
|AC\-23/24|`.codex/skills/proactive-message/scripts/should_disturb.py`|
|AC\-25|`.codex/skills/proactive-message/scripts/send.py`|
|AC\-26|`AGENTS.md` / `tools/README.md`（投递口径）\+ Agent 行为|

