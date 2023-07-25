import React, { useEffect } from 'react';
import { Color, PieceSymbol, type Square as SquareType } from "chess.js";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import Square from "./Square";
import { piecesMap } from '../../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';
import { init } from '../../lib/redux';

const Board: React.FC = () => {
    const { game, board, possibleMoves, capturedPieces, moveHistory } = useSelector((state: RootState) => state.chess);

    const dispatch = useDispatch<any>()
    useEffect(() => {
        if (!game) dispatch(init())
    }, [game])

    const determineSquareColor = (file: string, rank: string, isPossibleMove: boolean) => {
        if (isPossibleMove) return "yellow.500";
        return (file.charCodeAt(0) - parseInt(rank)) % 2 === 0 ? "#B58863" : "#F0D9B5";
    };

    const renderSquare = (piece: {
        square: SquareType;
        type: PieceSymbol;
        color: Color;
    } | null, i: number) => {
        const file = String.fromCharCode(i % 8 + 97);  // ASCII 'a' = 97
        const rank = 8 - Math.floor(i / 8);
        const square = `${file}${rank}` as SquareType;

        const isPossibleMove = possibleMoves.includes(square as SquareType);
        const backgroundColor = determineSquareColor(file, rank.toString(), isPossibleMove);

        return (
            <Square
                key={i}
                value={piece ? piece.type : ""}
                bgColor={backgroundColor}
                position={square}
                highlight={isPossibleMove}
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
                {board?.flat().map((piece, i) => renderSquare(piece, i))}
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
