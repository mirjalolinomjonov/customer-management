<template>
  <div>
    <table class="table w-full text-left border-collapse">
      <thead class="table-header">
        <tr>
          <th v-for="(item, index) in headers" :key="index" class="table-header__item">
            {{ item }}
          </th>
        </tr>
      </thead>

      <tbody class="table-body">
        <tr v-for="row in props.tableData" :key="row.id" class="table-body__row">
          <td v-for="(item, index) in row" :key="index" class="table-body__row-item">
            <span
              v-if="Array.isArray(item) && item.length"
              class="flex flex-wrap gap-[5px] max-w-[500px]"
            >
              <span
                v-for="(el, index) in item"
                :key="index"
                class="py-[2px] px-1 rounded-md bg-[#ddd]"
              >
                {{ el }}
              </span>
            </span>
            <span v-else>{{ item }}</span>
          </td>
          <td class="table-body__row-item">
            <div class="inline-flex items-center gap-2">
              <span @click="editCustomer(row.id)" class="w-6 h-6 block">
                <img class="object-cover" src="@/assets/icons/edit.png" alt="edit" />
              </span>
              <span @click="$emit('removeOneCustomer', row.id)" class="w-6 h-6 block">
                <img class="object-cover" src="@/assets/icons/delete.png" alt="delete" />
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- confirm deletion modal-->
    <div class="modal flex-center-center" :class="{ active: isShowModal }">
      <div class="modal__content flex flex-col justify-between">
        <p class="modal__content-info">Are you sure you want to delete?</p>
        <div class="flex-center gap-5 self-end">
          <button @click="confirmation(false)" class="modal__content-btn">cancel</button>
          <button @click="confirmation(true)" class="modal__content-btn">yes</button>
        </div>
      </div>
      <div @click="confirmation(false)" class="modal__bg cursor-pointer"></div>
    </div>

    <!-- editing modal -->
    <div class="edit-modal" :class="{ active: isShowEditModal }">
      <form @submit.prevent="addCustomer" class="form flex flex-col gap-5">
        <div class="flex justify-end mb-5">
          <button @click="$emit('closeEditModal')" class="w-5 h-5">
            <img src="@/assets/icons/cancel.png" alt="" />
          </button>
        </div>
        <div v-for="(item, index) in formFields" :key="index" class="form-field">
          <label class="form-field__label block mb-2 cursor-pointer" :for="item.vmodel">{{
            item.label
          }}</label>
          <input
            class="form-field__input"
            v-model="form[item.vmodel]"
            :type="item.type"
            :name="item.vmodel"
            :id="item.vmodel"
            :placeholder="item.placeholder"
          />
        </div>
        <button class="form__submit" type="submit">Submit</button>
      </form>
      <div @click="$emit('closeEditModal')" class="edit-modal__bg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { ICustomer } from '@/types/customer'
import { useCustomersStore } from '@/stores/customers'

// DATA
const store = useCustomersStore()
let form = ref<ICustomer>({
  id: undefined,
  name: '',
  age: undefined,
  email: '',
  phone: '',
  hobbies: ''
})
const formFields = ref([
  {
    vmodel: 'name',
    label: 'Full name',
    placeholder: 'Enter full name',
    type: 'text'
  },
  {
    vmodel: 'age',
    label: 'Age',
    placeholder: 'Enter your age',
    type: 'number'
  },
  {
    vmodel: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    type: 'email'
  },
  {
    vmodel: 'phone',
    label: 'Phone number',
    placeholder: 'Enter phone number',
    type: 'string'
  },
  {
    vmodel: 'hobbies',
    label: 'Hobbies',
    placeholder: 'Enter with a comma',
    type: 'text'
  }
])

const headers = ref(['id', 'name', 'age', 'email', 'phone', 'hobbies', 'actions'])
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  isShowModal: Boolean,
  isShowEditModal: Boolean
})

const emits = defineEmits([
  'confirmation',
  'editOneCutomer',
  'removeOneCustomer',
  'closeEditModal',
  'addCustomer'
])

// METHODS
function confirmation(event: boolean) {
  emits('confirmation', event)
}
function addCustomer() {
  let newId = new Date().getTime()

  emits('addCustomer', { ...form.value, id: newId })
  form.value = { id: undefined, name: '', age: undefined, email: '', phone: '', hobbies: [] }
}
function editCustomer(event: number) {
  form.value = store.getCustomerEditable(event)[0]
  emits('editOneCutomer', event)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins.scss';

.table {
  box-shadow: 0 0 12px 2px #eee;

  // table-header
  &-header {
    @include font-size(16px, 500, 22px, #f1fef8);
    background: #019878;
    // table-header__item
    &__item {
      padding: 12px 18px;
      &::first-letter {
        text-transform: uppercase;
      }
      &:first-child {
        border-radius: 8px 0 0 0;
      }
      &:last-child {
        border-radius: 0 8px 0 0;
        max-width: 500px;
      }
    }
  }
  // table-body
  &-body {
    // table-body__row
    &__row {
      transition: all, 0.15s, ease-in-out;
      &:hover {
        cursor: pointer;
        background: #f2f4f3;
        .table-body__row-item {
          color: #019878;
          font-weight: 500;
        }
      }
      // table-body__row-item
      &-item {
        @include font-size(14px, 400, 22px, #1b1514);
        padding: 12px 18px;
        transition: all 0.15s ease-in-out;
        &:nth-child(2)::first-letter {
          text-transform: uppercase;
        }
      }
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  z-index: -999;
  transition: all 0.15s ease-in-out;
  &.active {
    opacity: 1;
    visibility: visible;
    z-index: 999;
  }
  // modal__content
  &__content {
    position: relative;
    width: 450px;
    height: 200px;
    padding: 24px;
    border-radius: 8px;
    background: #fff;
    z-index: 1;
    // modal__content-info
    &-info {
      @include font-size(16px, 500, 24px, #019878);
    }
    // modal__content-btn
    &-btn {
      @include font-size(14px, 500, 12px, #1b1514);
      padding: 12px 18px;
      border-radius: 6px;
      text-transform: capitalize;
      transition: all 0.15 ease-in-out;
      &:first-child:hover {
        color: #019878;
      }
      &:last-child {
        background: #019878;
        color: #fff;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          transform: scale(0.99);
        }
      }
    }
  }
  // modal__bg
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000069;
  }
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  z-index: -999;
  transition: all 0.15s ease-in-out;
  &.active {
    opacity: 1;
    visibility: visible;
    z-index: 999;
  }
  .form {
    position: relative;
    width: 450px;
    z-index: 2;
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    // form-field
    &-field {
      width: 100%;
      border-radius: 6px;
      // form-field__label
      &__label {
        @include font-size(16px, 600, 12px, #1b1514);
      }
      // form-field__input
      &__input {
        @include font-size(16px, 500, 12px, #1b1514);
        width: 100%;
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid #ddd;
        outline: none;
      }
    }
    // form__submit
    &__submit {
      @include font-size(16px, 600, 12px, #fff);
      width: 100%;
      padding: 16px;
      border-radius: 6px;
      background: #019878;
      transition: all 0.15s ease-in-out;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        transform: scale(0.99);
      }
    }
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000069;
  }
}
</style>
