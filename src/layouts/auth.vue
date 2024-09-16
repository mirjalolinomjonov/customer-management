<template>
  <main class="flex-center-center min-h-screen">
    <KeepAlive>
      <component
        :is="activeComponent"
        @login="login($event)"
        @register="register($event)"
        @changeAuth="changeAuth($event)"
      />
    </KeepAlive>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

// DATA
const router = useRouter()
let activeComponent = ref(Login)

function changeAuth(event: string) {
  if (event === 'login') {
    activeComponent.value = Login
  } else if (event === 'register') {
    activeComponent.value = Register
  }
}
function login(event: object) {
  let user = localStorage.getItem('user')
  if (user !== null) {
    user = JSON.parse(user)
    if (user.email === event.email && user.password === event.password) {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'auth' })
      alert('Email or Password is incorrect!')
    }
  } else {
    alert('You have not registered before!')
    router.push({ name: 'auth' })
  }
}
function register(event: object) {
  localStorage.setItem('user', JSON.stringify(event))
  router.push({ name: 'home' })
}
</script>

<style lang="scss">
@import '@/assets/styles/_mixins.scss';

.form {
  width: 350px;
  // form-field
  &-field {
    width: 100%;
    border-radius: 6px;
    // border: 1px solid #ddd;
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
  // form__change-login-register
  &__change-login-register {
    @include font-size(16px, 400, 12px, #27272e);
    transition: color 0.15s ease-in-out;
    text-align: left;
    &:hover {
      color: #019878;
    }
  }
}
</style>
