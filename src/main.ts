import { createApp } from 'vue'
import App from './App.vue'

//Element PLUS
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//
import MttkVueWrap from 'mttk-vue-wrap'
//
createApp(App).use(ElementPlus).use(MttkVueWrap).mount('#app')
