<script setup>
import { computed } from "vue";
import { useUserStore } from "./stores/user.js";
import { useLayoutStore } from "./stores/layout.js";

import Connect from "./components/main/connect.vue";
import Main from "./components/main/main.vue";
import Nav from "./components/main/nav.vue";
import { setBrowserHeight } from "./utils/setBrowserHeight";

const userStore = useUserStore();
const layoutStore = useLayoutStore();

const user = computed(() => userStore.user);
const activeNav = computed(() => layoutStore.activeNav);

setBrowserHeight();
</script>

<template>
  <Connect v-if="!user.nickname" />

  <transition
    enter-active-class="animate__animated animate__backInDown"
    leave-active-class="animate__animated animate__backOutUp"
    mode="out-in"
  >
    <Nav v-if="user.nickname && activeNav" />
  </transition>
  <Main v-if="user.nickname" />
</template>

<style scoped>
.animate__animated.animate__backInDown {
  --animate-duration: 0.5s;
}
.animate__animated.animate__backOutUp {
  --animate-duration: 0.5s;
}
</style>
