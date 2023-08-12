export const toggleFullscreen = () =>  {
  if (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    // O documento está em modo de tela cheia, solicita a saída do modo de tela cheia
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari e Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // Internet Explorer/Edge
      document.msExitFullscreen();
    }
  } else {
    // O documento não está em modo de tela cheia, solicita a entrada no modo de tela cheia
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      // Chrome, Safari e Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      // Internet Explorer/Edge
      document.documentElement.msRequestFullscreen();
    }
  }
}
