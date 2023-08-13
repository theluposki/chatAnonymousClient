import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "../views/notFound.vue";
import Conversations from "../views/conversations.vue";
import Contacts from "../views/contacts.vue";
import Chat from "../views/chat.vue"

const routes = [
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/", component: Conversations },
  { path: "/contacts", component: Contacts },
  { path: "/chat/:item/", component: Chat },

];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
