<template>
  <el-table-column :min-width="colWidth" :align="colAlign">
    <template #default="sp" v-if="hasChildren">
      <slot v-bind="sp">{{ sp.row[attrs.prop] }}</slot>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { useSlots, unref, computed, useAttrs } from 'vue'
import { obtainTableData } from './ElTableUtil'
//
export interface OptionType {
  widthPerChar: number
  widthBase: number
  suppressColWidth: boolean
  suppressAlign: boolean
}
export interface Props {
  option: OptionType
}
const props = withDefaults(defineProps<Props>(), {
  option: () => {
    return {
      widthPerChar: 10,
      widthBase: 16,
      suppressColWidth: false,
      suppressAlign: false
    }
  }
})

//Whether there is child slot
const hasChildren = computed(() => !!useSlots().default)
//
const attrs = useAttrs()
//table data
const tableData = obtainTableData()

//Calculate column width automatically
const colWidth = computed(() => {
  if (props.option?.suppressColWidth) {
    return ''
  }
  //use byte length instead of string length,it may be a good idea to handle charaters like Chinese
  let maxLength = strLength(attrs.label || '')
  //
  const data = unref(tableData)
  if (Array.isArray(data) && data.length > 0 && attrs.prop) {
    //
    for (const row of data) {
      const v = row[attrs.prop]
      if (v != undefined) {
        //
        maxLength = Math.max(maxLength, strLength(v.toString() || v))
      }
    }
  }
  //
  // console.log('Final', attrs.label, maxLength, 10 * maxLength + 16 + 'px')
  //
  return (props.option.widthPerChar || 10) * maxLength + (props.option.widthBase || 16) + 'px'
})
//Try to find a to get string length which may meet the size displayed on screen
//
const encoder = new TextEncoder()
function strLength(str: string) {
  // console.log(str, encoder.encode(str).length,str.length,Math.floor(( encoder.encode(str).length + str.length)/2))
  return Math.floor((encoder.encode(str).length + str.length) / 2)
}
//
//whether data is number
const isNumberCol = computed(() => {
  //Table data
  const data = unref(tableData)
  if (Array.isArray(data) && data.length > 0 && attrs.prop) {
    return typeof data[0][attrs.prop] === 'number'
  }
  //
  return false
})
//
const colAlign = computed(() => {
  if (props.option?.suppressColWidth) {
    return ''
  }
  //
  return isNumberCol.value ? 'right' : 'left'
})
</script>
