// store/chessSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Chess, Square } from "chess.js";
import { ChessSliceStateType } from "../../types";

const game: Chess = new Chess();

const initialState: ChessSliceStateType = {
  board: game.board(),
  possibleMoves: [] as Square[],
  selectedSquare: null,
  moveHistory: game.history(),
  capturedPieces: [] as string[],
  status: game.fen(),
  turn: "w",
};

const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    selectSquare: (state, action: PayloadAction<Square>) => {
      const square = action.payload;

      // If a piece was previously selected
      if (state.selectedSquare) {
        // Try making a move
        const move = game.move({
          from: state.selectedSquare,
          to: square,
        });

        // If the move is successful
        if (move) {
          state.board = game.board();
          state.selectedSquare = null;
          state.possibleMoves = [];
          state.moveHistory = game.history();
          state.status = game.fen();
          state.turn = game.turn();
          if (move.captured) {
            state.capturedPieces.push(move.captured);
          }
        } else {
          // If not a valid move, reset selections
          state.selectedSquare = null;
          state.possibleMoves = [];
        }
      } else {
        const moves = game.moves({ square: square, verbose: true });
        if (moves.length) {
          state.selectedSquare = square;
          state.possibleMoves = moves.map((move) => move.to);
        }
      }
    },
    makeMove: (state, action: PayloadAction<{ from: string; to: string }>) => {
      const move = game.move(action.payload);
      if (move) {
        state.board = game.board();
        state.moveHistory = game.history();
        if (move.captured) {
          state.capturedPieces.push(move.captured);
        }
      }
    },
  },
});

export const { selectSquare, makeMove } = chessSlice.actions;
export const chessReducer = chessSlice.reducer;
