<script setup>
import { computed } from "vue"
import { useUserStore } from "./stores/user.js"
import { useLayoutStore } from "./stores/layout.js"

import Connect from "./components/main/connect.vue"
import Header from "./components/main/header.vue"
import Main from "./components/main/main.vue"
import Nav from "./components/main/nav.vue"

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const user = computed(() => userStore.user)
const activeNav = computed(() => layoutStore.activeNav)

</script>

<template>

  <Connect v-if="!user.nickname"/>
  
  <Nav v-if="user.nickname && activeNav"/>
  <Header v-if="user.nickname"/>
  <Main v-if="user.nickname"/>
</template>
