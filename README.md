# Element Pivot

## Brief

Element Plus does not provide a pivot table to, so here it is.
It is based on Element Plus Table.

![Screen](https://github.com/jamie-mttk/element-pivot/blob/master/src/screen.png)

## Installation

First Element should be installed.el-table and el-table-column should be registered.
Then install Element Pivot (The exmple below is using npm, please change properly if other package manager is used)

```sh
npm i element-pivot -save
```

## How to use

First import pivot

```sh
import { Pivot } from 'element-pivot'
```

Then use directly,attributes will be described at next chapter

```sh
 <Pivot
    :data="data"
    :dimensionCol="dimensionCol"
    :dimensionRow="dimensionRow"
    :metric="metric"
    :option="option"
  ></Pivot>
```

## Attributes

### data

Same as element table. It is an Array, a sample item is as below

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

Any array to describe the columns of horizontal direction.

Each array item has the following fields.
|Field|Description|
|---|---|
|key|Uniquely identify this dimension,it is also the field name in tableData|
|Label|Label to shown in table header|

An array item sample

```sh
{ key: 'city', label: 'City'}
```

### dimensionRow

Any array to describe the row of vertical direction.

Each array item has the following fields.
|Field|Description|
|---|---|
|key|Uniquely identify this dimension,it is also the field name in tableData|
|Label|Label to shown in row|
|Option|Normally used to control the column width,refer to ExtendTableColumn|

An array item sample

```sh
  { key: 'goods', label: 'Goods', option: { widthPerChar: 10, widthBase: 32 } }
```

### metric

Any array to describe the value to shown at the cross of dimension row and dimension column.

Each array item has the following fields.
|Field|Description|
|---|---|
|key|Uniquely identify this metric,it is also the field name in tableData|
|Label|Label to shown in row|
|Option|Normally used to control the column width,refer to ExtendTableColumn|
|formatter|Same as element table column formatter|

An array item sample

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

An object to optimize the pivot.

| Field                    | Default | Description                                                                                                                          |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| showMetricHeaderStrategy | auto    | Whether metric header will be shown. 'show':Always show. 'hide':Always hide. 'auto':if there is only one metric, hide;otherwise show |

## ExtendTableColumn

Element plus table column can not be configured by MTTK vue wrap if there is grouping table head .
And ExtendTableColumn also implements the below features

- align
  If the column value is number, align to right;otherwise align to left.
- min-width
  Automatically calculate column min width from column label and column value.

### Attribute

Element plus table column attributes can be set directly, an additional attribute option is defined with follwing fields.
And please also note min-width and align can be set directly to override the result evaluated by ExtendTableColumn.

| Field            | Default | Description                       |
| ---------------- | ------- | --------------------------------- |
| widthPerChar     | 10      | Refer to ' min width calcuation'  |
| widthBase        | 16      | Refer to ' min width calcuation'  |
| suppressColWidth | false   | Set to true to not eval min width |
| suppressAlign    | false   | Set to true to not eval align     |

### min width calcuation

It is hard to calculate the width of an text to displayed in screen. Below is an estimation.

1. Calcuate the length of column label and all the values of this column , and get the maximized value.
2. Calcuate the text length.
   Length1=str.length
   Length2=new TextEncoder().encode(str)
   TextLength=(Length1+Length2)/2
   This is a compromise since some characters such as Chinese character may consume more space than English character
3. Calcuate min width
   min length=widthPerChar\*TextLength+widthBase+'px'

## Performance

It is NOT recommanded to tranfer a big data into tableData. Below is a simple performance test. The performance looks good.

| Rows of data | Data size(M) | Time cost(second) |
| ------------ | ------------ | ----------------- |
| 1,390,68     | 12.9         | 75                |
| 31,250       | 2.89         | 15                |

## Limitaion and Next step

1. Row/Col collapse support
2. Filter the row/col dimension values,for example only some city's data are displayed

## Licence

MIT
