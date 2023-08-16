export function setBrowserHeight() {
  const browserHeight = window.innerHeight;
  document.documentElement.style.setProperty(
    "--browser-height",
    `${browserHeight}px`
  );
  console.log(`${browserHeight}px`);
}

export function setBrowserHeightVh() {
  document.documentElement.style.setProperty(
    "--browser-height",
    `100vh`
  );
  console.log("100vh");
}
