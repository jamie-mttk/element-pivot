# Element透视表

[English version](https://github.com/jamie-mttk/element-pivot/blob/master/README.md)

## 简介

Element Plus没有提供透视表，所以这里有一个。
它基于Element Plus表格。
![屏幕截图](https://github.com/jamie-mttk/element-pivot/blob/master/src/screen.png)

## 安装

首先需要安装vue3和Element Plus。el-table和el-table-column应该被注册。
然后安装Element Pivot（下面的示例使用npm，请根据实际情况更改）

```sh
npm i element-pivot -save
```

## 如何使用

首先导入pivot

```sh
import { Pivot } from 'element-pivot'
```

然后直接使用，属性在下一章节中描述

```sh
<Pivot
:data="data"
:dimensionCol="dimensionCol"
:dimensionRow="dimensionRow"
:metric="metric"
:option="option"
> </Pivot>
```

## 属性

### data

与元素表相同。它是一个数组，示例项目如下

```sh
{
category: 'Electronic',
goods: 'Mouse',
province: 'An hui',
city: 'An qing',
district: 'Tai hu',
quantity: 222,
amount: 2220
}
```

### dimensionCol

任何数组都可以描述水平方向的列。
每个数组项具有以下字段。
|字段|描述|
|---|---|
|key|唯一标识此维度，也是表格数据中的字段名|
|label|显示在表头中的标签|

数组项示例

```sh
{ key: 'city', label: 'City'}
```

### dimensionRow

任何数组都可以描述垂直方向的行。
每个数组项具有以下字段。
|字段|描述|
|---|---|
|key|唯一标识此维度，也是表格数据中的字段名|
|label|显示在行中的标签|
|option|通常用于控制列宽度，参考ExtendTableColumn|

数组项示例

```sh
{ key: 'goods', label: 'Goods', option: { widthPerChar: 10, widthBase: 32 } }
```

### metric

任何数组都可以描述在维度行和维度列交叉处显示的值。
每个数组项具有以下字段。
|字段|描述|
|---|---|
|key|唯一标识此指标，也是表格数据中的字段名|
|label|显示在行中的标签|
|option|通常用于控制列宽度，参考ExtendTableColumn|
|formatter|与元素表列格式化器相同|

数组项示例

```sh
{
key: 'amount',
label: 'Amount',
option: { widthPerChar: 10, widthBase: 24 },
formatter: (row: any, column: any, cellValue: any, index: number) => {
    if (cellValue != undefined) {
     return '$' + cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
     return '-'
    }
}
}
```

### option

自定义透视的对象。

| 字段                     | 默认 | 描述                                                                                        |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------- |
| showMetricHeaderStrategy | auto | 是否显示指标头。'show':始终显示。'hide':始终隐藏。'auto':如果只有一个指标，则隐藏；否则显示 |

## ExtendTableColumn

如果存在分组表头，则Element Plus表列无法通过MTTK vue wrap进行配置。
ExtendTableColumn还实现了以下功能

- align
  如果列值是数字，则右对齐；否则左对齐。
- min-width
  从列标签和列值自动计算列的最小宽度。

### 属性

Element Plus表列属性可以直接设置，还定义了一个名为option的附加属性，具有以下字段。
请注意，min-width和align也可以直接设置以覆盖ExtendTableColumn计算出的结果。
|字段|默认|描述|
|---|---|---|
|widthPerChar|10|一个字符的宽度。参考“最小宽度评估”|
|widthBase|16|列的基本宽度。参考“最小宽度评估”|
|suppressColWidth|false|设置为true以不计算最小宽度|
|suppressAlign|false|设置为true以不计算对齐|

### 最小宽度评估

计算文本在屏幕上显示的宽度很困难。以下是一个估计。

1. 对于每个列，计算列标签和该列的所有值的长度，并获取最大值。
2. 计算文本长度。

   ```sh
   Length1=str.length
   Length2=new TextEncoder().encode(str)
   TextLength=(Length1+Length2)/2
   ```

这是一种妥协，因为某些字符（如中文字符）可能占用比英文字符更多的空间。

3. 计算最小宽度

```sh
min length=widthPerChar*TextLength+widthBase+'px'
```

## 性能

不建议将大量数据传输到tableData中。以下是一个简单的性能测试。性能看起来不错。
|数据行数|数据大小（M）|渲染时间（秒）|
|---|---|---|
|1,390,68|12.9|75|
|31,250|2.89|15|

## 限制和下一步

1. 行/列折叠支持
2. 过滤行/列维度值，例如仅显示某些城市的数据

## 许可证

MIT
