<template>
  <main class="main">
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
  </main>
</template>

<style scoped>

.main {
  background-color: transparent;
  min-height: calc(100vh - 50px);
  min-width: 100%;
}
</style>
