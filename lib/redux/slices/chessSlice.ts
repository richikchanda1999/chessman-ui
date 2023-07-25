// store/chessSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Chess, Square } from "chess.js";
import { ChessSliceStateType } from "../../types";

const initialState: ChessSliceStateType = {
  game: undefined,
  board: undefined,
  possibleMoves: [],
  selectedSquare: undefined,
  moveHistory: [],
  capturedPieces: [],
  status: undefined,
  turn: "w",
};

const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    init: (state) => {
      let game = state.game
      if (game === undefined) {
        game = new Chess();
        state.game = game;
      }
      state.board = game.board();
      state.status = game.fen();
      state.turn = game.turn() ?? "w";
    },
    selectSquare: (state, action: PayloadAction<Square>) => {
      let game = state.game;
      if (game === null) {
        state.game = new Chess();
      }

      const square = action.payload;

      // If a piece was previously selected
      if (state.selectedSquare) {
        // Try making a move
        const move = game?.move({
          from: state.selectedSquare,
          to: square,
        });

        // If the move is successful
        if (move) {
          state.board = game?.board();
          state.selectedSquare = undefined;
          state.possibleMoves = [];
          state.moveHistory = game?.history() ?? [];
          state.status = game?.fen();
          state.turn = game?.turn() ?? "w";
          if (move.captured) {
            state.capturedPieces.push(move.captured);
          }
        } else {
          // If not a valid move, reset selections
          state.selectedSquare = undefined;
          state.possibleMoves = [];
        }
      } else {
        const moves = game?.moves({ square: square, verbose: true });
        if (moves?.length) {
          state.selectedSquare = square;
          state.possibleMoves = moves.map((move) => move.to);
        }
      }
    },
    makeMove: (state, action: PayloadAction<{ from: string; to: string }>) => {
      let game = state.game;
      if (game === null) {
        state.game = new Chess();
      }

      const move = game?.move(action.payload);
      if (move) {
        state.board = game?.board();
        state.moveHistory = game?.history() ?? [];
        if (move.captured) {
          state.capturedPieces.push(move.captured);
        }
      }
    },
  },
});

export const { init, selectSquare, makeMove } = chessSlice.actions;
export const chessReducer = chessSlice.reducer;
