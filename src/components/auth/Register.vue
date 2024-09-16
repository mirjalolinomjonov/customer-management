<template>
  <section>
    <form @submit.prevent="$emit('register', form)" class="form flex flex-col gap-5">
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
          required
        />
      </div>

      <button class="form__submit" type="submit">Register</button>
      <button @click="$emit('changeAuth', 'login')" class="form__change-login-register">
        I already have an account
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IRegister } from '@/types/auth'

// DATA
const form = ref<IRegister>({
  name: '',
  email: '',
  password: ''
})

const formFields = ref([
  {
    vmodel: 'name',
    label: 'Full name',
    placeholder: 'Enter full name',
    type: 'text'
  },
  {
    vmodel: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email'
  },
  {
    vmodel: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password'
  }
])
</script>
