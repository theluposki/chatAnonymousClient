<script setup>
import { ref, computed } from "vue";
import { listCoversations } from "../mock/listCoversations.js";
import { useRouter } from "vue-router";
import HeaderM from "../components/main/header.vue";
import { useUserStore } from "../stores/user.js";
const userStore = useUserStore();

const user = computed(() => userStore.user);

const { push } = useRouter();

const setLink = (link) => {
  push(link);
};

const list = ref(listCoversations);

const convertObjectToBase64 = (value) => {
  const objetoJSON = JSON.stringify(value);
  const encoder = new TextEncoder();
  const objetoBytes = encoder.encode(objetoJSON);
  const base64String = btoa(String.fromCharCode.apply(null, objetoBytes));
  const encodedParam = encodeURIComponent(base64String); // Encoding for URL
  return encodedParam;
};
</script>

<template>
  <div class="conversations">

    <HeaderM v-if="user.nickname" />
    <ul class="list">
      <li
        class="item"
        v-for="item in list"
        :key="item.id"
        @click="
          setLink(
            `/chat/${convertObjectToBase64({
              id: item.id,
              nickname: item.nickname,
              picture: item.picture,
            })}`
          )
        "
      >
        <div class="wrapper-image">
          <img :src="item.picture" class="image" alt="image" />
        </div>
        <div class="details">
          <span class="time">
            {{ item.createdAt }}
          </span>
          <h3>{{ item.nickname }}</h3>
          <span class="lastMessage">
            {{ item.lastMessage }}
          </span>
        </div>
      </li>
      <li class="end-list">--</li>
    </ul>
  </div>
</template>

<style scoped>
.conversations {
  width: 100%;
  height: 100vh;
}
.list {
  position: relative;
  list-style: none;
  background-color: transparent;

  min-height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: auto;

  padding: 8px 10px;

  display: flex;
  flex-flow: column;
  gap: 8px;
  cursor: pointer;
}

.end-list {
  text-align: center;
  color: #ddd;
  font-size: 12px;
}

.item {
  min-height: 80px;
  background-color: rgba(33, 33, 33, 0.8);

  display: flex;
  align-items: center;

  border-radius: 6px;
  box-shadow: inset 0 0 3px black, 0 0 13px black;
  overflow: hidden;
  padding: 4px;
}

.item:active {
  scale: 0.95;
}

.wrapper-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-left: 4px;
}

.image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.item h3 {
  flex: 1;
  min-width: 150px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 22px;
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 70px;
  max-height: 70px;
  overflow: hidden;
}

.lastMessage {
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  color: var(--white2);
  padding: 8px 14px;
  font-size: 14px;
}

.time {
  height: 20px;
  max-height: 20px;
  font-size: 12px;
  padding: 0 14px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #ddd;
}
</style>
