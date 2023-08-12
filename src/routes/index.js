import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "../views/notFound.vue";
import Home from "../views/home.vue";
import About from "../views/about.vue";

const routes = [
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/", component: Home },
  { path: "/about", component: About },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
