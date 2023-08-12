import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const activeNav = ref(false)

  const toggleActiveNav = () => {
    activeNav.value = !activeNav.value
  }

  return {
    activeNav,
    toggleActiveNav
  };
});
