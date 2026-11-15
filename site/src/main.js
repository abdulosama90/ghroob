const time = document.querySelector("#demo-time");

function updateTime() {
  if (!time) return;
  time.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date()).replace(/\s?(am|pm)/i, "");
}

updateTime();
setInterval(updateTime, 30_000);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches) {
  const root = document.documentElement;
  window.addEventListener("pointermove", (event) => {
    root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth - 0.5) * 10}px`);
    root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight - 0.5) * 8}px`);
  }, { passive: true });
}
