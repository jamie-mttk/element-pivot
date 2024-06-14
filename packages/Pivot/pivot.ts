import {
  parseDimensionTree,
  buildColumn,
  buildSpanMethod,
  hasChildren,
  leafCount
} from './pivotUtil'

//Limitation
//1. Row/Col collapse support
//2. Filter the row/col dimension values,for example only some city's data are displayed
const SEPERATOR = '~'
//option - showMetricHeaderStrategy   show hide auto(auto means if hide if there is only one metric),default is auto
export default function build(
  data: any[],
  dimensionCol: any[],
  dimensionRow: any[],
  metric: any[],
  option: any = {}
) {
  // Get the row and col data with tree structure
  const dimensionColTree = parseDimensionTree(data, dimensionCol)
  const dimensionRowTree = parseDimensionTree(data, dimensionRow)
  //Whether to show metric header
  const showMetricHeader = getShowMetricHeader()
  //Since the raw col key(something like category1~subcategory1~material1) is too long,so use a short col key and use colMap to map between raw col key and short col key
  //and please note the colKey mentioned here does not include the last part(value metric)
  const colMap: any = {}
  //
  const { tableData, spans } = buildData()
  //table config
  const tableConfig = buildConfig()
  //
  return { tableConfig }
  function getShowMetricHeader() {
    const strategy = option.showMetricHeaderStrategy || 'auto'
    if (strategy == 'show') {
      return true
    } else if (strategy == 'hide') {
      return false
    } else {
      return metric.length > 1
    }
  }
  function buildData() {
    //Data to render table
    const tableData: any[] = []
    //Record the colspan of the dimensionRow columns
    const spans: any[] = []
    //This is used quickly find the line no in result by row key
    const rowMap: any = {}

    //Current handling row
    let rowIndex = 0
    //Use to generate short col key
    let colIndex = 0
    //
    const stack: any[] = []
    //init empty  data with all dimensionRow
    for (const node of dimensionRowTree) {
      buildEmptyData(node)
    }

    //fill table data one by one
    for (const d of data) {
      //find the row
      let rowKey = ''
      for (const dimension of dimensionRow) {
        rowKey += (rowKey ? SEPERATOR : '') + d[dimension.key]
      }
      const rowIndex = rowMap[rowKey]
      const row = tableData[rowIndex]
      //
      let colKey = ''
      for (const dimension of dimensionCol) {
        colKey += SEPERATOR + d[dimension.key]
      }
      //
      let colKeyShort = colMap[colKey]
      if (!colKeyShort) {
        colKeyShort = 'V_' + colIndex++
        colMap[colKey] = colKeyShort
      }
      //
      for (const m of metric) {
        const key = colKeyShort + SEPERATOR + m.key
        //Here we sum if value is already existed
        //This will happen if the dimensionRow/Col is not the final level
        row[key] = (row[key] || 0) + d[m.key]
      }
    }
    //
    return { tableData, spans }

    function buildEmptyData(node: any) {
      stack.push({ node, rowIndex })
      //
      if (hasChildren(node)) {
        //That means this is not the leaf node,try next
        for (const child of node.children) {
          buildEmptyData(child)
        }
        //
      } else {
        //this is final level
        const d: any = {}
        tableData.push(d)
        //spans
        const span: any[] = []
        spans.push(span)
        //
        let rowKey = ''
        //
        for (let i = stack.length - 1; i >= 0; i--) {
          //
          const stackNode = stack[i].node
          //
          rowKey = stackNode.value + (rowKey ? SEPERATOR : '') + rowKey
          //
          d['H_' + stackNode.dimension.key] = stackNode.value

          //span
          if (i == stack.length - 1) {
            //that means it is final level,no need to set span
          } else {
            // console.log('~~~~~~~~', stack[i].rowIndex == rowIndex, stack[i].rowIndex, rowIndex)
            if (stack[i].rowIndex == rowIndex) {
              //That means it is the first time of this value appear,set span
              span[i] = leafCount(stackNode)
            } else {
              span[i] = 0
            }
          }
        }
        //row map
        rowMap[rowKey] = rowIndex
        //
        rowIndex++
      }
      //
      stack.pop()
    }
  }

  function buildConfig() {
    //
    const config = {
      '~': 'el-table',
      style: { height: '100%' },
      border: true,
      data: tableData,
      'span-method': buildSpanMethod(spans),
      '#': []
    }

    //Columns to display dimensionRow - the left blank corner
    let parentSlot: any[] = config['#']
    //Depth is the empty column depth
    const depth = dimensionCol.length - (showMetricHeader ? 0 : 1)
    for (let i = depth; i >= 0; i--) {
      if (i != 0) {
        //Build a empty column to hold the dimensionRow columns
        const slot = []
        parentSlot.push(
          //Hide all the cell bottom except the last one
          buildColumn({
            align: 'left',
            'label-class-name': i == 1 ? 'header-normal' : 'header-normal hide-cell-bottom',
            '#': slot
          })
        )
        parentSlot = slot
      } else {
        //Last level,append all the dimension Y label
        for (let j = 0; j < dimensionRow.length; j++) {
          //
          parentSlot.push(
            buildColumn({
              align: 'left',
              prop: 'H_' + dimensionRow[j].key,
              label: dimensionRow[j].label,
              'label-class-name': 'header-normal',
              option: dimensionRow[j].option
            })
          )
        }
      }
    }
    //Columns of each dimension col value
    buildColConfig(config['#'], dimensionColTree, metric, [])
    //
    // console.log(config)
    //
    return config
  }
  function buildColConfig(parentSlot: any[], nodeList: any[], metric: any[], stack: any[]) {
    for (const node of nodeList) {
      //
      stack.push(node)
      //
      const slotTemp: any[] = []
      const col = buildColumn({
        label: node.value,
        align: 'left',
        'label-class-name': 'header-normal',
        '#': slotTemp
      })
      parentSlot.push(col)
      if (hasChildren(node)) {
        //this is not last level
        buildColConfig(col['#'], node.children, metric, stack)
      } else {
        //Last level,append value columns/Metric
        //build col key
        let colKey = ''
        for (const s of stack) {
          colKey += SEPERATOR + s.value
        }
        //Find short col key
        const colKeyShort = colMap[colKey]
        //
        for (const m of metric) {
          const prop = colKeyShort + SEPERATOR + m.key
          slotTemp.push(
            buildColumn({
              prop,
              label: m.label,
              align: 'right',
              option: m.option,
              'label-class-name': showMetricHeader
                ? 'header-normal'
                : 'header-normal metric-header-invisible',
              formatter: m.formatter
            })
          )
        }
      }
      //
      stack.pop()
    }
  }
}
