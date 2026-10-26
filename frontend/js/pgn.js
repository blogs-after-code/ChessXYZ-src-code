// pgn.js - PGN text in, plain game data out (no DOM, no drawing)
import { Chess } from "../vendor/chess.js";

export const MAX_PGN_BYTES = 200 * 1024; // PRD F1: over 200 KB is rejected

// Input:  pgn (string)
// Output: { headers, moves } on success. Throws Error with a user-readable message on failure.
export function parsePgn(pgn) {
  const text = pgn.trim();

  if (text === "") {
    throw new Error("Paste a PGN first.");
  }

  // Blob counts bytes; string.length counts characters, which can undercount
  if (new Blob([text]).size > MAX_PGN_BYTES) {
    throw new Error("PGN is too large (limit is 200 KB).");
  }

  const chess = new Chess();
  try {
    // chess.js 1.x throws on invalid PGN, so we catch it and show a friendlier message
    chess.loadPgn(text);
  } catch {
    throw new Error("That doesn't look like a valid PGN. Check for typos or illegal moves.");
  }

  const moves = chess.history({ verbose: true });
  if (moves.length === 0) {
    throw new Error("No moves found in that PGN.");
  }

  return { headers: chess.header(), moves };
}
