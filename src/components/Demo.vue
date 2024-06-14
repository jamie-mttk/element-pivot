<template>
  <h3>Pivot Table Demo 1</h3>
  <Pivot
    :data="data"
    :dimensionCol="dimensionCol"
    :dimensionRow="dimensionRow"
    :metric="metric"
    :option="{}"
  ></Pivot>
  <h3>Pivot Table Demo 2</h3>
  <Pivot
    :data="data"
    :dimensionCol="dimensionRow"
    :dimensionRow="dimensionCol"
    :metric="metric"
    :option="{}"
  ></Pivot>
</template>

<script setup lang="ts">
import { data } from './data'
import Pivot from '../../packages/Pivot/index.vue'
//
const dimensionCol = [
  { key: 'province', label: 'Province' },
  { key: 'city', label: 'City' },
  { key: 'district', label: 'District' }
]
const dimensionRow = [
  { key: 'category', label: 'Category' },
  { key: 'goods', label: 'Goods', option: { widthPerChar: 10, widthBase: 32 } }
]
const metric = [
  {
    key: 'quantity',
    label: 'Quantity',
    formatter: (row: any, column: any, cellValue: any, index: number) => {
      if (cellValue != undefined) {
        return cellValue
      } else {
        return '-'
      }
    }
  },
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
]
// const reverse = false
// //
// const { tableConfig } = build(
//   tableData,
//   reverse ? dimensionRow : dimensionCol,
//   reverse ? dimensionCol : dimensionRow,
//   metric,
//   { showMetricHeaderStrategy: 'show' }
// )
</script>
<style></style>
