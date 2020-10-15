function parseOcrData(data) {
  console.log(data);
  const wordSearchGrid = [];
  const wordsToFind = [];
  let temporaryRow = [];
  let tempWord = "";
  [...data].forEach((char) => {
    if (wordSearchGrid.length < 10) {
      if (isLetter(char)) temporaryRow.push(char);
      else if (isNum(char) && wordSearchGrid.length === 5)
        temporaryRow.push(char);
      if (temporaryRow.length === 10) {
        wordSearchGrid.push(temporaryRow);
        temporaryRow = [];
      }
    } else {
      if (isLetter(char)) tempWord += char;
      else if (tempWord.length > 0) {
        wordsToFind.push(tempWord);
        tempWord = "";
      }
    }
  });
  return { wordSearchGrid, wordsToFind };
}

function isLetter(char) {
  return /^[a-zA-Z]+$/.test(char);
}

function isNum(char) {
  return /^[0-9]+$/.test(char);
}

// parseOcrData(
//   "asdfghjklasdfghjklqwertyuvnfjgbfjfdjfhfdjdjdnfjvfnvjfjfnvnvjfidjdjgklsdjglsjordnosidjoisjdgvsjdroijiorvjiordjorjoirjodisjvosdrjoisjdrigojrovsdvmxlvoijriojdvnriorojoifd"
// );

module.exports = {
  parseOcrData,
};
