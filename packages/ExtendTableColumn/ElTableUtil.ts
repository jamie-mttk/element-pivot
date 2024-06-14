import { unref, computed, getCurrentInstance } from "vue";

export function obtainTableData() {
  return computed(() => {
    //
    let temp = getCurrentInstance();
    while (temp && temp.parent) {
      temp = temp.parent;
      if (temp?.props?.data && Array.isArray(temp.props.data)) {
        return unref(temp.props.data);
      }
    }
    //
    return [];
  });
}

export function obtainSpanMethod(tableData?) {
  return ({ row, column, rowIndex, columnIndex }) => {
    if(!tableData){
      tableData=obtainTableData()
    }
    //
    const colProp = column.property;
    if (!colProp) {
      return {
        rowspan: 1,
        colspan: 1,
      };
    }
    //   if (columnIndex === 0) {
    if (
      rowIndex > 0 &&
      row[colProp] === unref(tableData)[rowIndex - 1][colProp]
    ) {
      //   console.log(rowIndex,columnIndex,0,0,colProp,row[colProp])
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      let rowspan = 1;
      for (let i = rowIndex + 1; i < unref(tableData).length; i++) {
        if (unref(tableData)[i][colProp] === row[colProp]) {
          rowspan++;
        } else {
          break;
        }
      }
      //   console.log(rowIndex,columnIndex,rowspan,1,colProp,row[colProp])
      return {
        rowspan,
        colspan: 1,
      };
    }
    //   }
  };
}
