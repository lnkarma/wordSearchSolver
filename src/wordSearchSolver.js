// const wordSearchSolver = require("word-search-solver");

// const grid = [
//   "B U D W E I S E R K",
//   "T K C R A T S T A I",
//   "T W S O C H I A N L",
//   "E T F O K R G O A A",
//   "S T R O U N V C G N",
//   "M E A P A E G L N J",
//   "I V A R N V Y B A I",
//   "D T A E M D T E K F",
//   "I H I R O A H S I B",
//   "T N A R A K S C L E",
// ];

const grid = [
  ["B", "U", "D", "W", "E", "I", "S", "E", "R", "K"],
  ["T", "K", "C", "R", "A", "T", "S", "T", "A", "I"],
  ["T", "W", "S", "O", "C", "H", "I", "A", "N", "L"],
  ["E", "T", "F", "O", "K", "R", "G", "O", "A", "A"],
  ["S", "T", "R", "O", "U", "N", "V", "C", "G", "N"],
  ["M", "E", "A", "P", "A", "E", "G", "L", "N", "J"],
  ["I", "V", "A", "R", "N", "V", "Y", "B", "A", "I"],
  ["D", "T", "A", "E", "M", "D", "T", "E", "K", "F"],
  ["I", "H", "I", "R", "O", "A", "H", "S", "I", "B"],
  ["T", "N", "A", "R", "A", "K", "S", "C", "L", "E"],
];

const words = [
  "SOCH",
  "OVEN",
  "ISHA",
  "KOFTE",
  "STARC",
  "KARAN",
  "SAMRAT",
  "KANGANA",
  "KILANJI",
  "TIRUPATI",
  "BUDWEISER",
  "ARM",
  "EAL",
];

let wordsFound = [];
// console.log(wordSearchSolver(grid, words));
function wordSearchSolver(grid, words) {
  const reversedWords = words.map((word) => [
    word,
    word.split("").reverse().join(""),
  ]);

  console.time("parsewords");
  const secondaryDiagonalWords = [];
  const primaryDiagonalWords = [];
  const horizontalWords = [];
  const verticalWords = [];
  for (let i = 0; i < grid.length; i++) {
    let horizontalWord = "";
    let verticalWord = "";
    for (let j = 0; j < grid.length; j++) {
      // /
      if (i + j + 1 > secondaryDiagonalWords.length) {
        secondaryDiagonalWords.push(grid[i][j]);
      } else {
        secondaryDiagonalWords[i + j] += grid[i][j];
      }
      // \
      if (i + j + 1 > primaryDiagonalWords.length) {
        primaryDiagonalWords.push(grid[i][9 - j]);
      } else {
        primaryDiagonalWords[i + j] += grid[i][9 - j];
      }
      // -|
      horizontalWord += grid[i][j];
      verticalWord += grid[j][i];
    }
    horizontalWords.push(horizontalWord);
    verticalWords.push(verticalWord);
  }
  console.timeEnd("parsewords");

  console.time("searchWords");
  const horizontallySearchedWords = searchWords(
    reversedWords,
    horizontalWords,
    horizontalSaveWords
  );

  const verticallySearchedWords = searchWords(
    horizontallySearchedWords,
    verticalWords,
    verticalSaveWords
  );

  const secondaryDiagonalSearchedWords = searchWords(
    verticallySearchedWords,
    secondaryDiagonalWords,
    secondaryDiagonalSaveWords
  );

  const primaryDiagonalSearchedWords = searchWords(
    secondaryDiagonalSearchedWords,
    primaryDiagonalWords,
    primaryDiagonalSaveWords
  );

  console.timeEnd("searchWords");

  tempWordsFound = [...wordsFound];
  wordsFound = [];
  return tempWordsFound;
}
function searchWords(mirroredWords, words, locationGenerator) {
  return mirroredWords.filter(([originalWord, mirroredWord]) => {
    return !words.some((word, wordIndex) => {
      let searchIndex = word.indexOf(originalWord);
      let mirroredWordMatched = false;
      if (searchIndex === -1) {
        searchIndex = word.indexOf(mirroredWord);
        if (searchIndex === -1) {
          return false;
        }
        mirroredWordMatched = true;
      }
      // console.log(originalWord, searchIndex, wordIndex, mirroredWordMatched);

      wordsFound.push(
        locationGenerator(
          wordIndex,
          searchIndex,
          originalWord,
          mirroredWordMatched
        )
      );

      return true;
    });
  });
}

function horizontalSaveWords(row, index, word, isMirrored) {
  const start = [isMirrored ? index + word.length - 1 : index, row];
  const end = [isMirrored ? index : word.length - 1 + index, row];

  return { word, start, end };
}

function verticalSaveWords(row, index, word, isMirrored) {
  const start = [row, isMirrored ? index + word.length - 1 : index];
  const end = [row, isMirrored ? index : word.length - 1 + index];

  return { word, start, end };
}

function secondaryDiagonalSaveWords(row, index, word, isMirrored) {
  const startY = (row > 9 ? row - 9 : 0) + index;
  const endY = startY + word.length - 1;

  const startX = Math.min(row, 9) - index;
  const endX = startX - (word.length - 1);

  const start = isMirrored ? [endX, endY] : [startX, startY];
  const end = isMirrored ? [startX, startY] : [endX, endY];

  return { word, start, end };
}

function primaryDiagonalSaveWords(row, index, word, isMirrored) {
  const startY = (row > 9 ? row - 9 : 0) + index;
  const endY = startY + word.length - 1;

  const startX = 9 - Math.min(row, 9) + index;
  const endX = startX + (word.length - 1);

  const start = isMirrored ? [endX, endY] : [startX, startY];
  const end = isMirrored ? [startX, startY] : [endX, endY];

  return { word, start, end };
}

// console.log(verticallySearchedWords);
// console.log(wordsFound);
// console.log(wordSearchSolver(grid, words));

module.exports = { wordSearchSolver };
