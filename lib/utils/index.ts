export const CONTRACT = "0xECC6562faDB918EF8950010E43Ae1AF62a49cF16";

export const piecesMap: { [key: string]: string } = {
  K: "♔",
  Q: "♕",
  R: "♖",
  N: "♘",
  B: "♗",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  n: "♞",
  b: "♝",
  p: "♟",
};

export const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export function fenToArray(fen: string) {
  const [rows] = fen.split(" ");
  return rows.split("/").map((row) => {
    const arr: (string | null)[] = [];
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (isNaN(Number(char))) {
        // if the character is not a number, it's a piece
        arr.push(char);
      } else {
        // if the character is a number, it represents empty squares
        for (let j = 0; j < Number(char); j++) {
          arr.push(null);
        }
      }
    }
    return arr;
  });
}

export function uint8ArrayToString(array: Uint8Array) {
  // const chunks = [];
  // let result = "";

  // for (let i = 0; i < array.length; i++) {
  //     const byte = array[i];
  //     if (byte <= 0x7F) {
  //         result += String.fromCharCode(byte);
  //     } else if (byte <= 0xBF) {
  //         const prevByte = array[i - 1];
  //         const unicodeChar = ((prevByte & 0x1F) << 6) | (byte & 0x3F);
  //         result += String.fromCharCode(unicodeChar);
  //     } else if (byte <= 0xDF) {
  //         const nextByte = array[++i];
  //         const unicodeChar = ((byte & 0x1F) << 6) | (nextByte & 0x3F);
  //         result += String.fromCharCode(unicodeChar);
  //     } else {
  //         const byte2 = array[++i];
  //         const byte3 = array[++i];
  //         const unicodeChar = ((byte & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
  //         result += String.fromCharCode(unicodeChar);
  //     }

  //     if (result.length > 8192) {
  //         chunks.push(result);
  //         result = "";
  //     }
  // }

  // if (result) {
  //     chunks.push(result);
  // }

  // return chunks.join("");
  return new TextDecoder('iso-8859-2').decode(array);
}


export function stringToUint8Array(str: string) {
  // const encodedString = encodeURIComponent(str);
  // const uintArray = [];

  // for (let i = 0; i < encodedString.length; i++) {
  //     const char = encodedString[i];
  //     if (char === '%') {
  //         const byte1 = encodedString[i + 1];
  //         const byte2 = encodedString[i + 2];
  //         const byteValue = parseInt(byte1 + byte2, 16);
  //         uintArray.push(byteValue);
  //         i += 2;
  //     } else {
  //         uintArray.push(char.charCodeAt(0));
  //     }
  // }

  // return new Uint8Array(uintArray);
  return new TextEncoder().encode(str);
}
