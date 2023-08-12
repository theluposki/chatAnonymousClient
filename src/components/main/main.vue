<template>
  <main class="main">
    <router-view v-slot="{ Component }">
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
.animate__animated.animate__fadeIn {
  --animate-duration: 0.5s;
}
.animate__animated.animate__fadeOut {
  --animate-duration: 0.5s;
}
.main {
  position: fixed;
  top: 60px;
  left: 0;

  background-color: transparent;
  min-height: calc(100vh - 50px);
  min-width: 100%;
}
</style>
