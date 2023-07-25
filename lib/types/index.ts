import { Chess, Square } from "chess.js";

export type ChessSliceStateType = {
  game: Chess | undefined;
  board: ReturnType<Chess["board"]> | undefined;
  possibleMoves: Square[];
  selectedSquare: Square | undefined;
  moveHistory: string[];
  capturedPieces: string[];
  status: string | undefined;
  turn: "w" | "b";
};
