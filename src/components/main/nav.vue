<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router";

import { useUserStore } from "../../stores/user.js";

const userStore = useUserStore()

const { push, currentRoute } = useRouter();

const pathname = computed(() => currentRoute.value.fullPath);

const setLink = (link) => {
  push(link);
};
</script>

<template>
    <nav class="nav">
      <button  @click="setLink('/')" :class="pathname === '/' ? 'btn active' : 'btn'">
        <i class='bx bx-conversation' ></i>
      </button>

      <button  @click="setLink('/contacts')" :class="pathname === '/contacts' ? 'btn active' : 'btn'">
        <i class='bx bxs-contact' ></i>
      </button>

      <button class="btn" @click="userStore.logout">
        <i class='bx bx-log-out'></i>
      </button>
    </nav>
</template>

<style scoped>
.nav {
  position: absolute;
  top: 56px;
  left: 0;

  width: 100%;
  min-height: 64px;
  z-index: 3;

  border-radius: 0 0 20px 20px;
  background-color: var(--dark2);
  padding: 8px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.active {
  transition: all ease .4s;
  background-color: var(--current-primary);
  color: var(--white);
}
</style>
