---
title: qPCR数据处理指北
publishDate: 2025-10-01 08:00:00
description: PlateEditor 与定制化 Excel 模板的 qPCR 数据标准化处理流程
tags:
  - qPCR
  - 数据处理
  - PlateEditor
  - 工具
language: 中文
---
提供一套完整的 qPCR 数据处理流程，涵盖原始数据的孔板编辑、信息整理，以及利用 Excel 实现自动化分析与结果可视化。

## 一、孔板数据编辑与格式转换

[PlateEditor](https://www.fanguanghan.homes/PlateEditor.html) 是一个用于编辑和管理 PCR 实验孔板数据的在线工具，支持 Bio-Rad 和 Roche 仪器数据的导入与可视化编辑。具体的操作步骤如下：
### 1. **导入原始数据**

1. Bio-Rad仪器导出方式：
	- 在 CFX Manager 软件中选择 `Export` → `Custom Export` → `Export`
	- 保存为 `.xlsx` 或 `.xls` 格式
	- 在 [PlateEditor](https://www.fanguanghan.homes/PlateEditor.html) 的右侧 **"Data Import"** 区域上传该文件
	
		![biorad-1.png](https://raw.githubusercontent.com/hanhan124/blog_bed/main/img/20251002003946848.png)
	
2. Roche 仪器（LightCycler）导出方式：
	- 导出 `.txt` 文本文件
	- 全选内容并复制粘贴至 Excel 表格
	- 另存为 `.xlsx` 文件后上传至 [PlateEditor](https://www.fanguanghan.homes/PlateEditor.html)
### 2. 孔板编辑与标注

在 [PlateEditor](https://www.fanguanghan.homes/PlateEditor.html) 中可对每个孔进行样本名（Sample Name）和目标基因（Target Gene）的批量标注：

1. **选择孔位**：
    - 单孔点击即可
    - 点击行标签（A–P）选择整行
    - 点击列标签（1–24）选择整列
    - 按住鼠标左键拖拽选择矩形区域
2. **输入信息**： 在右侧面板填写：
    - `Sample Name`：如 WT_Control、KO_Treatment 等
    - `Target Gene`：如 _GAPDH_, _ACTB_, _IL-6_ 等
3. **应用设置**： 点击 **"Apply"** 按钮，所选孔位即被赋予对应标签
### 3. 数据清理

若需重置部分或全部数据，可使用以下功能：

- **Clear Selection**：取消当前选区
- **Clear Sample**：清除选中孔的样本名称
- **Clear Gene**：清除选中孔的目标基因
- **Clear Values**：清除选中孔的所有定量数据（CT 值等）
- **Reset All Data**：恢复整个孔板为空状态
### 4. 导出标准化数据

完成编辑后，在 **"Data Export"** 区域点击 **"Export"** 按钮，系统将自动生成并下载两个文件：

1. **Excel 文件（.xlsx）**：包含原始 CT 值、样本名、基因名及统计摘要
2. **PNG 图片**：孔板布局图，可用于报告或论文配图
## 二、数据分析

1. 打开导出的 Excel 数据文件
2. 将内参基因（如 _TBP_, _GAPDH_, _ACTB_）所在列移动至所有目标基因前列
3. 复制以下关键列数据到 [QPCR_input.xlsm]([QPCR_input.xlsm](https://github.com/hanhan124/blog_bed/blob/main/QPCR_input.xlsm)) 中，随后点击按钮即可分析并生成结果
    - Sample Name（样本名称）
    - Target Gene（目标基因）
    - CT 值（通常为 "Cq" 或 "Cycle Threshold" 列）
4. 使用前请确保仅打开此一个 Excel 工作簿（避免宏运行冲突）；5. 文件为 `.xlsm` 格式，启用宏后方可执行分析
5. 程序将自动执行：
    - ΔΔCt 计算
    - 相对表达量（2^(-ΔΔCt)）转换
    - 组间均值与标准差统计
    - 生成柱状图（Bar Plot）与数值表格
6. 结果输出在同一工作簿的不同 sheet 中，可直接复制图表用于汇报

![qpcr_input.png](https://raw.githubusercontent.com/hanhan124/blog_bed/main/img/20251002010647314.png)

Over~