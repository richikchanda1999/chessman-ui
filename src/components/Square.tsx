import { Box, Text } from "@chakra-ui/react";
import { piecesMap } from "src/utils";

interface SquareProps {
    value: string | null;
    color: any;
    isSelected: boolean;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, color, isSelected, onClick }) => {
    const pieceSymbol = value ? piecesMap[value.toUpperCase()] : "";

    return (
        <Box
            width="60px"
            height="60px"
            backgroundColor={ color} // dark gray for black pieces and yellow for white pieces
            border="1px solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={isSelected ? "0 0 0 3px blue" : "none"}
            borderColor={isSelected ? "blue.500" : "transparent"}
            borderWidth={isSelected ? "1px" : "0px"}
            margin={"1px"}
            cursor="pointer"
            onClick={onClick}
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
                {pieceSymbol}
            </Text>
        </Box>
    );
};

export default Square;
