<template>
  <main class="container !pb-6">
    <header class="header py-5 flex-center-between">
      <div class="inline-flex items-center gap-6">
        <div class="search-field w-[350px] h-10 border rounded-lg overflow-hidden">
          <input
            v-model="search"
            type="text"
            placeholder="Search by name"
            class="text-base w-full h-full text-[#1b1514] outline-none pl-3 pr-10 inline-flex-center-center"
          />
          <span @click="search = ''" v-if="search" class="search-field__cancel w-4 h-4">
            <img src="@/assets/icons/cancel.png" alt="" class="w-full h-full" />
          </span>
        </div>
        <!-- create customer -->
        <button
          @click="isShowEditModal = true"
          class="py-2 px-5 bg-[#019878] rounded-lg text-white text-base transition-all hover:opacity-80 active:scale-[.99]"
        >
          Add customer
        </button>
      </div>
      <!-- user profile -->
      <div
        class="profile w-9 h-9 rounded-full inline-flex-center-center cursor-pointer text-white text-[16px] font-semibold uppercase bg-gray-400"
      >
        {{ profile }}
        <div class="profile__dropdown">
          <button @click="logout" class="profile__dropdown-item mb-3">logout</button>
          <button @click="deleteAccount" class="profile__dropdown-item">delete account</button>
        </div>
      </div>
    </header>

    <div v-if="!store.loading">
      <div v-if="searchFilterByName && searchFilterByName.length">
        <CustomersTable
          :tableData="paginationList(currentPage, pager)"
          :isShowModal="isShowModal"
          :isShowEditModal="isShowEditModal"
          @confirmation="confirmation($event)"
          @editOneCutomer="editOneCutomer($event)"
          @removeOneCustomer="removeOneCustomer($event)"
          @closeEditModal="isShowEditModal = false"
          @addCustomer="store.addCustomer($event)"
        />
        <div class="flex justify-end mt-5">
          <Pagination @pagination="pagination($event)" :list="searchFilterByName" />
        </div>
      </div>
      <SearchFailer v-else />
    </div>
    <!-- loading -->
    <div v-else class="loading">
      <span class="loading__spinner"></span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import CustomersTable from '@/components/CustomersTable.vue'
import Pagination from '@/components/Pagination.vue'
import SearchFailer from '@/components/searchFailer.vue'
import { useCustomersStore } from '@/stores/customers'

// DATA
let search = ref<string>('')
let isShowModal = ref<boolean>(false)
let isShowEditModal = ref<boolean>(false)
let customerId = ref<number>()
let currentPage = ref<number>(1) // default value
let pager = ref<number>(10) // default value
let profile = ref<string>('')
const store = useCustomersStore()
const router = useRouter()

// COMPUTED
const searchFilterByName = computed(() => {
  return store.customers.filter((user) =>
    user.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
const paginationList = computed(() => {
  return (currentPage: number = 1, pager: number = 10) => {
    return searchFilterByName.value.slice((currentPage - 1) * pager, pager * currentPage)
  }
})

// WATCH
watch(isShowEditModal, (evt) => {
  if (evt) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
watch(isShowModal, (evt) => {
  if (evt) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// LIFECYCLE HOOKS
onMounted(() => {
  store.fetchCustomers()
  const user = localStorage.getItem('user')
  if (user !== null) {
    JSON.parse(user)
      .name.split(' ')
      .forEach((el: string) => {
        profile.value += el.substr(0, 1)
      })
  }
})

// METHODS
function editOneCutomer(event: number) {
  isShowEditModal.value = true
  console.log('get', store.getCustomerEditable(event))
  // form.value = store.getCustomerEditable(event)
}
function removeOneCustomer(id: number) {
  customerId.value = id
  isShowModal.value = true
}
function confirmation(event: boolean) {
  if (event) {
    store.removeOneCustomer(customerId.value)
    alert('Successful deleted')
  }
  isShowModal.value = false
}
function pagination(event: any) {
  currentPage.value = event.currentPage
  pager.value = event.pager
}
function logout() {
  router.push({ name: 'auth' })
}
function deleteAccount() {
  localStorage.removeItem('user')
  location.reload()
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.search-field {
  position: relative;
  // search-field__cancel
  &__cancel {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    cursor: pointer;
    border-radius: 50%;
  }
}

.profile {
  position: relative;
  &:hover &__dropdown {
    visibility: visible;
  }
  // profile__dropdown
  &__dropdown {
    width: 150px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px 0 #ddd;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 5px);
    visibility: hidden;
    transition: all 0.15s ease-in-out;
    // profile__dropdown-item
    &-item {
      @include font-size(16px, 500, 12px, #1b1514);
      width: 100%;
      text-align: left;
      text-transform: capitalize;
      transition: color 0.15s ease-in-out;
      outline: none;
      &:hover {
        color: #019878;
      }
    }
  }
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000069;
  display: grid;
  place-content: center;
  z-index: 999;
  // loading__spinner
  &__spinner {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border-top: 4px solid #fbbf24;
    border-left: 4px solid #fbbf24;
    z-index: -1;
    animation: spinner 1s linear infinite;
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
