<script setup>
import { useUserStore } from "../../stores/user.js";
import { ref } from "vue";

const userStore = useUserStore();

const activeMainLogin = ref(true);
const activeMainLogup = ref(false);

const timeout = ref("");

const nickname = ref("Luposki");
const password = ref("1234");
const remember = ref();
const message = ref("");

const lock = ref(true);

const fnLock = () => {
  const passwordEl = document.getElementById("password");
  if (passwordEl.type === "password") {
    lock.value = false;
    passwordEl.type = "text";
    return;
  }

  lock.value = true;
  passwordEl.type = "password";
};

const reset = () => {
  lock.value = true;
  nickname.value = "";
  password.value = "";
  message.value = "";
};

const setMessage = (msg) => {
  clearTimeout(timeout.value);
  message.value = msg;
  timeout.value = setTimeout(() => (message.value = ""), 3000);
};

const fnActiveMainLogin = () => {
  reset();
  activeMainLogin.value = true;
  activeMainLogup.value = false;
};

const fnActiveMainLogup = () => {
  reset();
  activeMainLogin.value = false;
  activeMainLogup.value = true;
};

const login = async () => {
  if (!nickname.value || !password.value) {
    setMessage("Digite um nome e uma senha");
    return;
  }
  const result = await userStore.login(nickname.value, password.value);
  setMessage(result);
};

const logup = async () => {
  if (!nickname.value || !password.value) {
    setMessage("Digite um nome e uma senha");
    return;
  }

  const result = await userStore.logup(nickname.value, password.value);
  setMessage(result);
};
</script>

<template>
  <div class="connect">
    <header class="header">
      <div
        :class="activeMainLogin ? 'btn-header active' : 'btn-header'"
        @click="fnActiveMainLogin"
      >
        Acessar
      </div>
      <div
        :class="activeMainLogup ? 'btn-header active' : 'btn-header'"
        @click="fnActiveMainLogup"
      >
        Criar usuário
      </div>
    </header>

      <div class="main" v-if="activeMainLogin">
        <input
          type="text"
          class="input"
          v-model="nickname"
          placeholder="digite o seu nome do usuário"
        />
        <div class="pass">
          <input
            type="password"
            class="input"
            v-model="password"
            id="password"
            placeholder="digite sua senha"
          />
          <button class="btn" @click="fnLock">
            <i class="bx bx-lock-alt" v-if="lock"></i>
            <i class="bx bx-lock-open-alt" v-else></i>
          </button>
        </div>

        <label for="remember" class="remember">
          <i class="bx bx-checkbox" v-if="!remember"></i>
          <i class="bx bx-checkbox-checked" v-if="remember"></i>
          Me manter conectado:
          <span class="rememberBool">
            {{ remember ? "Sim" : "Não" }}
          </span>
          <input type="checkbox" id="remember" v-model="remember" hidden />
        </label>

        <p class="message">{{ message }}</p>

        <button class="btn btn-full" @click="login">Acessar</button>
      </div>

      <div class="main" v-if="activeMainLogup">
        <input
          type="text"
          class="input"
          v-model="nickname"
          placeholder="digite um nome do usuário"
        />
        <div class="pass">
          <input
            type="password"
            class="input"
            v-model="password"
            id="password"
            placeholder="digite uma senha"
          />
          <button class="btn" @click="fnLock">
            <i class="bx bx-lock-alt" v-if="lock"></i>
            <i class="bx bx-lock-open-alt" v-else></i>
          </button>
        </div>

        <p class="message">{{ message }}</p>

        <button class="btn btn-full" @click="logup">Criar</button>
      </div>
  </div>
</template>

<style scoped>
.animate__animated.animate__fadeIn {
  --animate-duration: .1s;
}
.animate__animated.animate__fadeOut {
  --animate-duration: .1s;
}
.connect {
  min-width: 400px;
  max-width: 400px;
  min-height: 100vh;
  max-height: 100vh;

  display: flex;
  margin: 0 auto;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  max-height: 50px;
  background-color: #212121;
  padding: 4px;
  border-bottom: solid 2px var(--dark);
}

.btn-header {
  flex: 1;
  min-height: 42px;
  max-height: 42px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;

  border-radius: 6px;
}

.active {
  color: var(--current-primary);
  box-shadow: inset 0 0 6px var(--current-primary);
  background-color: var(--dark);
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  min-height: calc(100vh - 50px);
  max-height: calc(100vh - 50px);
  background-color: rgba(33, 33, 33, 0.7);
  padding: 0 24px;
  gap: 20px;
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

.pass {
  width: 100%;
  display: flex;
  gap: 6px;
}

.btn-full {
  width: 100%;
  background-color: var(--current-primary);
  color: var(--white);
  font-weight: bold;
  font-size: 18px;
}

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.remember {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

.remember i {
  font-size: 24px;
}

.rememberBool {
  color: var(--current-primary);
}
</style>
