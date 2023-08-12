import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "../views/notFound.vue";
import Conversations from "../views/conversations.vue";
import Contacts from "../views/contacts.vue";

const routes = [
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/", component: Conversations },
  { path: "/contacts", component: Contacts },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
