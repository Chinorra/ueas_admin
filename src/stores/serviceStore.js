import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServiceStore = defineStore('serviceStore', () => {
  const currentService = ref(null)

  function setService(service) {
    currentService.value = service
  }

  return { currentService, setService }
})
