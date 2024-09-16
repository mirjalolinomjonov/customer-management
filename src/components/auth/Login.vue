<template>
  <section>
    <form @submit.prevent="$emit('login', form)" class="form flex flex-col gap-5">
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

      <button class="form__submit" type="submit">Login</button>
      <button @click="$emit('changeAuth', 'register')" class="form__change-login-register">
        Don't have an account?
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ILogin } from '@/types/auth'

// DATA
const form = ref<ILogin>({
  email: '',
  password: ''
})

const formFields = ref([
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
