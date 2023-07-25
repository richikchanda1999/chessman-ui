import { Box, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { piecesMap } from "src/utils";
import { selectSquare } from "../../lib/redux";
import { type Square as SquareType } from "chess.js";

type SquareProps = {
    value: string | null;
    bgColor: string;
    position: SquareType;
    highlight: boolean; // for possible moves highlight
};

const Square: React.FC<SquareProps> = ({ value, bgColor, position, highlight }) => {
    const pieceSymbol = value ? piecesMap[value.toUpperCase()] : "";

    const dispatch = useDispatch<any>();

    const handleClick = () => {
        dispatch(selectSquare(position)); // Here, we're assuming you handle source & target logic at the board level or within the Redux slice.
    };

    return (
        <Box
            width="60px"
            height="60px"
            backgroundColor={highlight ? "yellow.500" : bgColor} // dark gray for black pieces and yellow for white pieces
            border="1px solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={highlight ? "0 0 0 3px blue" : "none"}
            borderColor={highlight ? "blue.500" : "transparent"}
            borderWidth={highlight ? "1px" : "0px"}
            margin={"1px"}
            cursor="pointer"
            onClick={handleClick}
            _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }} // adding shadow on hover for interaction
            transition="box-shadow 0.3s ease"
        >
            <Text
                fontSize="3xl"
                fontWeight="bold"
                color={value && value.toLowerCase() === value ? "gray.800" : "yellow.400"}
                textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)"
                transform={pieceSymbol ? "scale(1)" : "scale(0.9)"}
                transition="transform 0.2s ease"
            >
                {pieceSymbol} {/* Temporarily use position if no pieceSymbol */}
            </Text>

        </Box>
    );
};

export default Square;
