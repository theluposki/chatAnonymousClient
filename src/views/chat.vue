<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useRoute, useRouter } from "vue-router";
import { useConversationsStore } from "../stores/conversations.js";
import { differenceInMinutes } from "date-fns";
import { socket } from "../socket.io";

const userStore = useUserStore();
const conversationsStore = useConversationsStore();
const message = ref("");
const friend = ref("");

socket.on("newMessage", async (data) => {
  setTimeout(() => scrollToBottom(), 100);
});

const { params } = useRoute();
const { go } = useRouter();

const user = computed(() => userStore.user);
const currentConversation = computed(
  () => conversationsStore.currentConversation
);

onMounted(() => {
  friend.value = convertBase64ToObject(params.item);
  conversationsStore.setCurrentConversation(
    convertBase64ToObject(params.item).id
  );
  setTimeout(() => {
    const messageContainer = document.getElementById("listMessages");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, 100);
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

const goBack = () => go(-1);

function scrollToBottom() {
  const messageContainer = document.getElementById("listMessages");

  if (
    messageContainer.scrollTop + messageContainer.clientHeight + 100 <
    messageContainer.scrollHeight
  ) {
    return;
  }

  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, createdAt);

  if (minutesAgo < 1) {
    return "agora mesmo";
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minutos atrás`;
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} ${hoursAgo === 1 ? "hora" : "horas"} atrás`;
  }
};

const sendMessage = async () => {
  if (!message.value) return;

  await conversationsStore.pushConversation({
    keyConversation: `${user.value.id}-${friend.value.id}`,
    senderNickname: user.value.nickname,
    sender: user.value.id,
    receiverNickname: friend.value.nickname,
    receiver: friend.value.id,
    message: message.value,
  });

  message.value = "";
  setTimeout(() => scrollToBottom(), 100);
};
</script>

<template>
  <div class="container">
    <header class="header">
      <button class="btn" @click="goBack">
        <i class="bx bx-arrow-back"></i>
      </button>

      <div class="details">
        <span class="nickname">{{ friend.nickname }}</span>
        <img class="imageFriend" :src="friend.picture" alt="image" />
      </div>
    </header>

    <main class="main">
      <ul class="listMessages" id="listMessages">
        <li
          :class="
            item.senderNickname != user.nickname
              ? 'messageItem receiverItem'
              : 'messageItem senderItem'
          "
          v-for="item in currentConversation"
          :key="item.id"
        >
          <span class="sender">{{ item.senderNickname }}</span>
          <span class="message">{{ item.message }}</span>
          <span class="createdAt">{{ getTimeAgo(item.createdAt) }}</span>
        </li>
      </ul>
    </main>

    <footer class="footer">
      <input
        type="text"
        v-model="message"
        class="input"
        id="message"
        autocomplete="off"
        placeholder="message"
        @keydown.enter="sendMessage"
      />
      <button class="btn" @click="sendMessage">
        <i class="bx bx-send"></i>
      </button>
    </footer>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}
.header {
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
  min-height: calc(100vh - 121px);
  max-height: calc(100vh - 121px);
  min-width: 100%;
  background-color: red;
}

.listMessages {
  min-height: calc(100vh - 121px);
  max-height: calc(100vh - 121px);

  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 8px 10px 26px 10px;
  scroll-behavior: smooth;
}

.messageItem {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: var(--dark2);
  max-width: 200px;
  min-width: 100px;
  padding: 0 12px;
}

.senderItem {
  background-color: var(--dark2);
  align-self: flex-end;

  border-radius: 6px 0 4px 6px;
  padding: 0 14px;
}

.receiverItem {
  background-color: var(--dark);
  border: solid 1px var(--dark2);
  box-shadow: inset 0 0 3px var(--current-primary);
  align-self: flex-start;

  border-radius: 0 6px 6px 4px;
  padding: 0 14px;
}
.sender {
  color: var(--current-primary);
  position: absolute;
  top: 4px;
  left: 14px;
  font-size: 12px;
}

.message {
  word-wrap: break-word;
  margin-top: 28px;
  margin-bottom: 16px;
  color: var(--white);
}

.createdAt {
  font-size: 10px;
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: #ddd;
}

.footer {
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

.input {
  width: 100%;
  min-height: 50px;
  max-height: 50px;

  padding: 0 12px;
  font-size: 16px;
  background-color: var(--dark);
  border: solid 2px var(--dark2);
  color: var(--white);
  border-radius: 6px;
}
</style>
