import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin
export const withInstall = <T extends { name?: string }>(component: T, alias?: string): SFCWithInstall<T> => {
  const comp = component as SFCWithInstall<T>

  comp.install = (app: App): void => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as SFCWithInstall<T>
}
