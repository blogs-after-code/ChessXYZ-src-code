// main.js - entry point: wires modules together (no logic of its own)
import { parsePgn } from "./pgn.js";
import { onLoadClicked, showMessage } from "./ui.js";

onLoadClicked((pgnText) => {
  try {
    const game = parsePgn(pgnText);
    const white = game.headers.White ?? "White";
    const black = game.headers.Black ?? "Black";
    showMessage(`Loaded ${game.moves.length} moves: ${white} vs ${black}`, "ok");
    console.log(game);
  } catch (err) {
    showMessage(err.message, "error");
  }
});
