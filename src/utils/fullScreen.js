import { setBrowserHeight, setBrowserHeightVh } from "./setBrowserHeight.js";

export const toggleFullscreen = () => {
  if (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    // Sair do modo de tela cheia
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setBrowserHeight()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      setBrowserHeight()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      setBrowserHeight()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      setBrowserHeight()
    }
  } else {
    // Entrar no modo de tela cheia
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        // Atualizar a altura do navegador após entrar no modo de tela cheia
        setBrowserHeightVh();
      });
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen().then(() => {
        setBrowserHeightVh();
      });
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen().then(() => {
        setBrowserHeightVh();
      });
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen().then(() => {
        setBrowserHeightVh();
      });
    }
  }
};
