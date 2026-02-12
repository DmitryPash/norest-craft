// src/vue-shims.d.ts (или shims-vue.d.ts)
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}