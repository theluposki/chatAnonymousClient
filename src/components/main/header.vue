<script setup>
import { computed } from 'vue';
import { useUserStore } from '../../stores/user.js';
import { useLayoutStore } from '../../stores/layout.js';

import { toggleFullscreen } from '../../utils/fullScreen.js'

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const user = computed(() => userStore.user)
const activeNav = computed(() => layoutStore.activeNav)
</script>

<template>
  <header class="header">
    <div class="logo" @click="toggleFullscreen"> 
      <span>MyReb</span>
    </div>

    <div class="user">
      <span>{{ user.nickname }}</span>
      <button class="btn" @click="layoutStore.toggleActiveNav">
        <i class='bx bx-menu' v-if="!activeNav"></i>
        <i class='bx bx-menu-alt-left' v-else></i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  width: 100%;
  min-height: 60px;
  max-height: 60px;
  background-color: var(--dark2);
  padding: 0 8px;
}

.logo {
  height: 50px;
  
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo span {
  font-weight: 600;
  color: var(--current-primary);
  font-size: 24px;  
}

.user {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  height: 50px;
}

.user span {
  font-weight: 600;
}
</style>
