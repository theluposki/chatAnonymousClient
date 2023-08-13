import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { socket } from "../socket.io.js";
import { api } from "../axios.js";
import { decryptValue, encryptValue } from "../utils/crypto.js";
import { db } from "../database/dexie.js";

export const useConversationsStore = defineStore("conversations", () => {
  const currentConversation = ref([]);
  const keyConversation = ref("");

  const myUser = ref({});

  socket.on("newMessage", async (data) => {
    console.log(data)
    await pushConversationReceiver(data)
  })

  onMounted(() => {
    if (localStorage.getItem("USER")) {
      myUser.value = JSON.parse(decryptValue(localStorage.getItem("USER")));
    }
  });

  const getConversations = async () => {
    try {
      const conversation = await db.conversations
        .where("keyConversation")
        .equals(keyConversation.value)
        .toArray();

      currentConversation.value = conversation;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const setCurrentConversation = async (friendId) => {
    keyConversation.value = `${myUser.value.id}-${friendId}`;
    await getConversations()
  };

  const pushConversationReceiver = async (body) => {
    try {
      await db.conversations.add({
        keyConversation: `${body.receiver}-${body.sender}`,
        senderNickname: body.senderNickname,
        sender: body.sender,
        receiverNickname: body.receiverNickname,
        receiver: body.receiver,
        message: body.message,
        createdAt: new Date(),
      });
      
      getConversations()
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const pushConversation = async (body) => {
    try {
      await db.conversations.add({
        keyConversation: body.keyConversation,
        senderNickname: body.senderNickname,
        sender: body.sender,
        receiverNickname: body.receiverNickname,
        receiver: body.receiver,
        message: body.message,
        createdAt: new Date(),
      });
      
      socket.emit("send_message", {
        senderNickname: body.senderNickname,
        sender: body.sender,
        receiverNickname: body.receiverNickname,
        receiver: body.receiver,
        message: body.message,
      })

      getConversations()
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return {
    currentConversation,
    setCurrentConversation,
    pushConversation,
  };
});
