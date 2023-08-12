<script setup>
import { ref, computed } from "vue"
import { useUserStore } from "./stores/user.js"
import Connect from "./components/main/connect.vue"

const userStore = useUserStore()

const user = computed(() => userStore.user)
</script>

<template>
  <Connect v-if="!user.nickname"/>

  <div class="panel" v-if="user.nickname">
    <h1>Seja ben-vindo!</h1>
    <button @click="userStore.logout" class="btn">Sair</button>
  </div>
</template>
