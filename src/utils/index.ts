export const piecesMap: {[key: string]: string} = {
    'K': '♔',
    'Q': '♕',
    'R': '♖',
    'N': '♘',
    'B': '♗',
    'P': '♙',
    'k': '♚',
    'q': '♛',
    'r': '♜',
    'n': '♞',
    'b': '♝',
    'p': '♟',
  };
  
  export const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  export function fenToArray(fen: string) {
    const [rows] = fen.split(" ");
    return rows.split("/").map(row => {
      const arr: (string | null)[] = [];
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (isNaN(Number(char))) { // if the character is not a number, it's a piece
          arr.push(char);
        } else { // if the character is a number, it represents empty squares
          for (let j = 0; j < Number(char); j++) {
            arr.push(null);
          }
        }
      }
      return arr;
    });
  }
  
  