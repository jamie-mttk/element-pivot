<template>
  <MttkWrapComp :config="tableConfig"></MttkWrapComp>
</template>
<script setup lang="ts">
import build from './pivot'
//
const props = defineProps<{
  data: Array<any>
  dimensionCol: Array<any>
  dimensionRow: Array<any>
  metric: Array<any>
  option?: Object
}>()
//
const { tableConfig } = build(
  props.data,
  props.dimensionCol,
  props.dimensionRow,
  props.metric,
  props.option
)
</script>
<style>
.metric-header-invisible {
  display: none;
}
.hide-cell-bottom {
  border-bottom: 0px !important;
}
/*Change the background of grouped columns to normal color */
.header-normal {
  background-color: var(--el-table-tr-bg-color) !important;
}
</style>
