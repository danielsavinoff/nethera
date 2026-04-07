import type { paths } from '~~/shared/types/generated/api'

type InstallPayload =
  paths['/api/bitrix/install']['post']['requestBody']['content']['application/json']

export const useInstallationStore = defineStore('installation', {
  state: () => ({
    installed: false
  }),

  actions: {
    async postInstall(payload: InstallPayload) {
      const { $api } = useNuxtApp()
      await $api('/api/bitrix/install', {
        method: 'POST',
        body: payload
      })
      this.installed = true
    }
  }
})
