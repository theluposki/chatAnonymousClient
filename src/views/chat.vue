<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();

const { params } = useRoute();
const { go } = useRouter();

const user = computed(() => userStore.user);

onMounted(() => {
  friend.value = convertBase64ToObject(params.item);
});

const convertBase64ToObject = (base64String) => {
  const decodedString = decodeURIComponent(base64String); // Decoding for URL
  const decodedBytes = atob(decodedString);
  const decoder = new TextDecoder();
  const decodedJSON = decoder.decode(
    new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0)))
  );
  const parsedObject = JSON.parse(decodedJSON);
  return parsedObject;
};

const friend = ref("");

const goBack = () => {
  go(-1);
};
</script>

<template>
  <div>
    <header class="header">
      <button class="btn" @click="goBack">
        <i class="bx bx-arrow-back"></i>
      </button>

      <div class="details">
        <span class="nickname">{{ friend.nickname }}</span>
        <img class="imageFriend" :src="friend.picture" alt="image" />
      </div>
    </header>

    <main class="main">main {{ friend.id }}</main>

    <footer class="footer">footer</footer>
  </div>
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

.main {
  position: fixed;
  top: 60px;
  left: 0;

  background-color: rebeccapurple;
  min-height: calc(100vh - 100px);
  min-width: 100%;
}

.footer {
  position: fixed;
  bottom: 0;
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

.details {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nickname {
  font-weight: 600;
}

.imageFriend {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
