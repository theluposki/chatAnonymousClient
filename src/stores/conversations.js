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

  socket.on("done", async (data) => {
    const { uuidMessage } = data
    try {
      const conversation = await db.conversations
        .where("uuidMessage")
        .equals(uuidMessage)
        .first();

      await db.conversations.update(conversation.id, {
        status: "done",
      });

      await getConversations();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });

  socket.on("newMessage", async (data) => {
    await pushConversationReceiver(data);

    socket.emit("message_done", {
      serverID: data.serverID,
      uuidMessage: data.uuidMessage,
    });
  });

  socket.on("have_new_messages", (data) => {
    data.forEach(async (item) => {
      await pushConversationReceiver(item);
      socket.emit("message_done", {
        serverID: item.id,
        uuidMessage: item.uuidMessage,
      });
    });
  });

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
    await getConversations();
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
        status: "done",
        uuidMessage: body.uuidMessage,
        createdAt: new Date(),
      });

      getConversations();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const pushConversation = async (body) => {
    let uuidMessage = self.crypto.randomUUID();
    try {
      await db.conversations.add({
        keyConversation: body.keyConversation,
        senderNickname: body.senderNickname,
        sender: body.sender,
        receiverNickname: body.receiverNickname,
        receiver: body.receiver,
        message: body.message,
        status: "pending",
        uuidMessage,
        createdAt: new Date(),
      });

      socket.emit("send_message", {
        senderNickname: body.senderNickname,
        sender: body.sender,
        receiverNickname: body.receiverNickname,
        receiver: body.receiver,
        message: body.message,
        status: "pending",
        uuidMessage,
      });

      getConversations();
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
