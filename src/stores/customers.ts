import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ICustomer } from '@/types/customer'

export const useCustomersStore = defineStore('customers', () => {
  // STATE
  const loading = ref<boolean>(false)
  const customers = ref<ICustomer[]>([])

  // GETTERS
  const getCustomerEditable = computed(() => {
    return (id: number) => customers.value.filter((el) => el.id === id)
  })
  // ACTIONS
  async function fetchCustomers() {
    const url = 'https://freetestapi.com/api/v1/users'
    try {
      loading.value = true
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()
      json.forEach((el) => {
        const { id, name, age, email, phone, hobbies } = el
        customers.value.push({ id, name, age, email, phone, hobbies })
      })
    } catch (error: any) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }
  function removeOneCustomer(id: number) {
    customers.value.map((el, index, arr) => {
      if (el.id === id) {
        arr.splice(index, 1)
      }
    })
  }
  function addCustomer(payload: ICustomer) {
    const { hobbies, ...rest } = payload
    console.log('pay', hobbies)
    console.log('rest', rest)

    customers.value.push(payload)
  }
  function editCustomer(payload: ICustomer, index: number) {
    customers.value[index] = payload
  }

  return {
    loading,
    customers,
    fetchCustomers,
    removeOneCustomer,
    addCustomer,
    editCustomer,
    getCustomerEditable
  }
})
