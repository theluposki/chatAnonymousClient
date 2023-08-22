<script setup>
import { ref, computed, onMounted, onBeforeUpdate } from "vue";
import { useUserStore } from "../stores/user";
import { useRoute, useRouter } from "vue-router";
import { useConversationsStore } from "../stores/conversations.js";
import { differenceInMinutes } from "date-fns";
import { socket } from "../socket.io";
import { setBrowserHeight } from "../utils/setBrowserHeight.js";

const userStore = useUserStore();
const conversationsStore = useConversationsStore();
const message = ref("");
const friend = ref("");

// window.addEventListener("resize", setBrowserHeight);

const friendIsTyping = ref("");

socket.on("newMessage", async () => {
  setTimeout(() => scrollToBottom(), 100);
});

socket.on("friend_is_typing", async (data) => {
  friendIsTyping.value = data.message;
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
    socket.emit("check_for_new_messages", {
      userId: user.value.id,
      friendId: friend.value.id,
    });

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
    status: "pending",
  });

  message.value = "";
  setTimeout(() => scrollToBottom(), 100);
};

const isTyping = () => {
  socket.emit("is_typing", {
    friendId: friend.value.id,
    nickname: user.value.nickname,
  });
};

const stoppedTyping = () => {
  socket.emit("stopped_typing", {
    friendId: friend.value.id,
  });
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
      <div class="friendIsTyping">{{ friendIsTyping }}</div>
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
          <span class="sender">
            {{ item.senderNickname }}
            <span class="status">
              <i class="bx bx-check-double" v-if="item.status === 'done'"></i>
              <i class="bx bx-check" v-if="item.status === 'pending'"></i>
            </span>
          </span>
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
        autosave="off"
        placeholder="message"
        @focus="isTyping"
        @focusout="stoppedTyping"
        @keydown.enter="sendMessage"
      />
      <button class="btn btn-send" @click="sendMessage">
        <i class="bx bx-send"></i>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: var(--browser-height);
  max-height: var(--browser-height);
}
.header {
  position: absolute;
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
  z-index: 4;
}

.main {
  position: absolute;
  top: 60px;
  left: 0;

  width: 100%;
  min-height: calc(var(--browser-height) - 120px);
  max-height: calc(var(--browser-height) - 120px);

  display: flex;

  background-color: transparent;
  z-index: 3;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 4;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  min-height: 60px;
  max-height: 60px;
  background-color: var(--dark2);
  padding: 0 8px;
}

.listMessages {
  min-width: 100%;
  flex-grow: 1;
  max-height: calc(var(--browser-height) - 120px);

  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 8px 10px 26px 10px;
  scroll-behavior: smooth;

  background-color: transparent;
}

.friendIsTyping {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: var(--dark6);
}

.messageItem {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: var(--dark2);
  max-width: 80%;
  min-width: 100px;
  padding: 0 12px;
}

.senderItem {
  position: relative;
  background-color: var(--dark3);
  align-self: flex-end;

  border-radius: 6px 0 4px 6px;
  padding: 0 14px;

  display: flex;
  flex-direction: column;
}

.senderItem::after {
  content: "";
  position: absolute;
  top: 0;
  right: -10px;

  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--dark3);
}

.receiverItem {
  position: relative;
  background-color: var(--dark2);
  align-self: flex-start;

  border-radius: 0 6px 6px 4px;
  padding: 0 14px;

  display: flex;
  flex-direction: column;
}

.receiverItem::after {
  content: "";
  position: absolute;
  top: 0;
  left: -10px;

  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--dark2);
}

.senderItem .sender {
  color: var(--current-primary);
  font-weight: 600;
  position: absolute;
  top: 1px;
  right: 8px;
  text-align: right;
  font-size: 10px;

  display: flex;
  align-items: center;
  gap: 4px;
}

.receiverItem .sender {
  color: var(--current-secondary);
  font-weight: 600;
  position: absolute;
  top: 1px;
  left: 8px;
  text-align: left;
  font-size: 10px;

  display: flex;
  align-items: center;
  gap: 4px;
}

.message {
  word-wrap: break-word;
  margin: 18px 0;
  color: var(--white);
}

.createdAt {
  font-size: 8px;
  position: absolute;
  bottom: 4px;
  left: 8px;
  color: #ddd;
}

.senderItem .createdAt {
  text-align: right;
  right: 8px;
}

.status {
  font-size: 14px;
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

  padding: 0 16px;
  font-size: 16px;
  background-color: var(--dark);
  color: var(--white);
  border-radius: 6px 6px 6px 26px;
  border: solid 2px var(--dark3);
}

.input:focus {
  border: solid 2px var(--current-primary);
}

.btn-send {
  max-height: 50px;
  border-radius: 6px 6px 26px 6px;
}
</style>
