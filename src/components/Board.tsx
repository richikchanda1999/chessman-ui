import React, { useState, useEffect } from 'react';
import { Chess, type Square as SquareType } from "chess.js";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import Square from "./Square";
import { piecesMap } from 'src/utils';

const game = new Chess();

interface BoardProps {
    currentPlayer: 'w' | 'b'; // 'w' for white, 'b' for black
    onPlayerChange: (player: 'w' | 'b') => void;
}

const Board: React.FC<BoardProps> = ({ onPlayerChange, currentPlayer }) => {
    const [board, setBoard] = useState(game.board());
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [selected, setSelected] = useState<SquareType | null>(null);
    const [capturedPieces, setCapturedPieces] = useState<string[]>([]);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);

    useEffect(() => {
        setBoard(game.board());
    }, []);

    const handleSquareClick = (square: SquareType) => {
        // If a piece was previously selected and the new clicked square is one of its possible moves
        if (selected && possibleMoves.includes(square)) {
            const moveResult = game.move({ from: selected, to: square });
            setSelected(null);
            setPossibleMoves([]);

            if (moveResult && moveResult.captured) {
                setCapturedPieces([...capturedPieces, moveResult.captured]);
            }
            
            if (moveResult) {
                setMoveHistory(prev => [...prev, moveResult.san]);
            }
        } else if (game.get(square)) {
            // If the clicked square has a piece, select it and show possible moves
            setSelected(square);
            const moves = game.moves({ square, verbose: true });
            setPossibleMoves(moves.map(move => move.to));
        } else {
            // Deselect the piece and clear possible moves
            setSelected(null);
            setPossibleMoves([]);
        }

        // Update the board state
        setBoard(game.board());

        const turn = game.turn();
        onPlayerChange(turn);
    };


    const determineSquareColor = (file: string, rank: string, isPossibleMove: boolean) => {
        if (isPossibleMove) return "yellow.500";
        return (file.charCodeAt(0) - parseInt(rank)) % 2 === 0 ? "#B58863" : "#F0D9B5";
    };

    const renderSquare = (piece: any, i: number) => {
        const file = String.fromCharCode(i % 8 + 97);  // ASCII 'a' = 97
        const rank = 8 - Math.floor(i / 8);
        const square = `${file}${rank}`;

        const isPossibleMove = possibleMoves.includes(square);
        const backgroundColor = determineSquareColor(file, rank.toString(), isPossibleMove);

        return (
            <Square
                key={i}
                value={piece ? piece.type : ""}
                color={backgroundColor}
                isSelected={square === selected}
                onClick={() => handleSquareClick(square as SquareType)}
            />
        );
    };

    return (
        <Flex gap={4}>
            <Box>
                Move History:
                {moveHistory.map((move, index) => (
                    <Text key={index}>{move}</Text>
                ))}
            </Box>

            <Grid templateColumns="repeat(8, 1fr)">
                {board.flat().map((piece, i) => renderSquare(piece, i))}
            </Grid>
            <Box>
                Captured Pieces:
                {capturedPieces.map((piece, index) => (
                    <Text key={index}>{piecesMap[piece.toUpperCase()]}</Text>
                ))}
            </Box>
        </Flex>

    );
};

export default Board;
