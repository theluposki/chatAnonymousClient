import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { socket } from "../socket.io.js";
import { api } from "../axios.js";
import { decryptValue, encryptValue } from "../utils/crypto.js";

export const useUserStore = defineStore("user", () => {
  const user = ref({});

  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("USER", encryptValue(JSON.stringify(userData)));
  };

  onMounted(() => {
    if (localStorage.getItem("USER")) {
      user.value = JSON.parse(decryptValue(localStorage.getItem("USER")));

      setTimeout(() => {
        socket.emit("user_connected", user.value)
      }, 100)
    }
  });

  const login = async (nickname, password) => {
    try {
      const response = await api.post("/login", {
        nickname,
        password,
      });
      setUser(response.data.user);
      return response.data.message;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        return error.response.data.error;
      }
    }
  };

  const logup = async (nickname, password) => {
    try {
      const response = await api.post("/logup", {
        nickname,
        password,
      });

      return response.data.message;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        return error.response.data.error;
      }
    }
  };

  const logout = () => {
    user.value = {}
    localStorage.removeItem("USER")
  }

  return {
    user,
    login,
    logup,
    logout
  };
});
