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

const activeBtnForceToBottom = ref(false);

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
  const messageContainer = document.getElementById("listMessages");
  friend.value = convertBase64ToObject(params.item);
  conversationsStore.setCurrentConversation(
    convertBase64ToObject(params.item).id
  );
  setTimeout(() => {
    socket.emit("check_for_new_messages", {
      userId: user.value.id,
      friendId: friend.value.id,
    });

    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, 100);

  let scrollTimeout;

  messageContainer.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      console.log("Página sendo rolada após um atraso.");
      scrollToBottom()
    }, 200);
  });
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
    activeBtnForceToBottom.value = true;
    return;
  }

  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
    activeBtnForceToBottom.value = false;
  }
}

function scrollForceToBottom() {
  const messageContainer = document.getElementById("listMessages");
  messageContainer.scrollTop = messageContainer.scrollHeight;
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
      <div
        class="btnScrollBottom"
        v-if="activeBtnForceToBottom"
        @click="scrollForceToBottom"
      >
        <i class="bx bx-chevrons-down"></i>
      </div>
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
          <span
            class="message"
            :data-nickname="item.senderNickname"
            :data-createdAt="getTimeAgo(item.createdAt)"
          >
            <span class="msg">{{ item.message }}</span>
            <span class="status">
              <i class="bx bx-check-double" v-if="item.status === 'done'"></i>
              <i class="bx bx-check" v-if="item.status === 'pending'"></i>
            </span>
          </span>
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
  min-height: 100vh;
  max-height: 100vh;
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
  z-index: 4;
}

.main {
  flex: 1;
  width: 100%;
  /* min-height: calc(100vh - 120px); */
  max-height: calc(100vh - 120px);

  display: flex;

  background-color: transparent;
  z-index: 3;
}

.footer {
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
  max-height: calc(100vh - 120px);

  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 8px 10px 26px 10px;
  scroll-behavior: smooth;

  background-color: transparent;
}

.friendIsTyping {
  position: absolute;
  bottom: 66px;
  left: 50%;
  transform: translate(-50%);

  font-size: 12px;
  color: var(--current-primary);
  background-color: var(--dark);
  padding: 2px 10px;
  border-radius: 25px;
  z-index: 4;
}

.btnScrollBottom {
  position: absolute;
  bottom: 76px;
  right: 35px;
  z-index: 4;

  width: 40px;
  height: 40px;

  font-size: 33px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: var(--current-primary);
  background-color: var(--dark);
  box-shadow: 0 0 6px var(--dark2);
}

.btnScrollBottom:active {
  scale: 0.95;
}

.messageItem {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: var(--dark2);
  max-width: 85%;
  width: fit-content;
  min-width: 70px;
  padding: 0 12px;
  margin: 14px 0;
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

.message {
  word-wrap: break-word;
  margin: 4px 0;
  color: var(--white);
  padding-bottom: 14px;
}

.message::before {
  content: attr(data-nickname);
  position: absolute;
  top: -16px;
  left: 0;

  background-color: var(--dark);
  padding: 1px 4px;
  border-radius: 25px;
  font-size: 8px;
}

.message::after {
  content: attr(data-createdAt);
  position: absolute;
  bottom: -16px;
  left: 0;

  background-color: var(--dark);
  padding: 1px 4px;
  border-radius: 25px;
  font-size: 8px;
}

.status {
  position: absolute;
  bottom: 0;
  right: 10px;
  font-size: 18px;
  color: var(--dark6);
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
