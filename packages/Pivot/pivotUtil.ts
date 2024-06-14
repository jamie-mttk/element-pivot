import ExtendTableColumn from '../ExtendTableColumn/index.vue'

//Convert dimension value to tree，the result is any array,each array item looks as below
//{dimension:'Dimension from paramter dimensions',value:'value of this dimension from data',children:[]}
// children is any array incldues the items under this node, structure is same as above
//
export function parseDimensionTree(data: any[], dimensions: any[]) {
  const result: any[] = []
  //Loop to process each row
  for (const dt of data) {
    let temp = result
    //Check dimensio from top to down
    for (const dimension of dimensions) {
      const value = dt[dimension.key]
      //Found incates whether this level of data is already existed
      let found = false
      for (const single of temp) {
        if (single.value == value) {
          //
          temp = single.children
          //
          found = true
          break
        }
      }
      //
      if (!found) {
        //not found at this level
        const children: any[] = []
        //
        temp.push({ dimension, value, children })
        temp = children
      }
    }
  }
  //
  return result
}
//
export function buildColumn(props = {}) {
  return {
    '~': ExtendTableColumn,
    ...props
  }
}

export function buildSpanMethod(spans: any[]) {
  return ({ rowIndex, columnIndex }: any) => {
    if (rowIndex >= spans.length) {
      return [1, 1]
    }
    //
    const span = spans[rowIndex]
    if (columnIndex >= span.length) {
      return [1, 1]
    }
    //
    return [span[columnIndex], 1]
  }
}

export function hasChildren(node: any) {
  return node.children && node.children.length > 0
}
export function leafCount(node: any) {
  if (!hasChildren(node)) {
    //this is final level
    return 1
  } else {
    let count = 0
    for (const child of node.children) {
      count += leafCount(child)
    }
    return count
  }
}
