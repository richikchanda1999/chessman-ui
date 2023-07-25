import { Chess, Square } from "chess.js";

export type ChessSliceStateType = {
  board: ReturnType<Chess["board"]>;
  possibleMoves: Square[];
  selectedSquare: Square | null;
  moveHistory: string[];
  capturedPieces: string[];
  status: string;
  turn: "w" | "b";
};
