// ui.js - DOM events, controls, messages (no chess logic here)

const pgnInput = document.getElementById("pgn-input");
const loadBtn = document.getElementById("load-btn");
const messageEl = document.getElementById("message");

// main.js passes in a function; ui.js calls it with the textarea text.
export function onLoadClicked(handler) {
  loadBtn.addEventListener("click", () => handler(pgnInput.value));
}

// type is "ok" or "error"; the CSS classes decide the color
export function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = type === "error" ? "message--error" : "message--ok";
}
