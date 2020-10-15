const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { wordSearchSolver } = require("./wordSearchSolver");
const { startUpBrowser, ocr } = require("./puppeteer");
const { parseOcrData } = require("./parseOcr");

const app = express();
var upload = multer({ dest: "uploads/" });
var page;

app.all("*", upload.single("source"), async (req, res) => {
  console.log(req.file);

  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `./uploads/image${Date.now()}.png`);
  fs.rename(tempPath, targetPath, (err) => {
    if (err) console.log(err);
  });

  // const ocrdata = await ocr(page, "uploads/image1602745993281.png");
  const ocrdata = await ocr(page, targetPath);
  // console.log(ocrdata);
  const { wordSearchGrid, wordsToFind } = parseOcrData(ocrdata);
  // console.log(wordSearchGrid);
  const solutions = wordSearchSolver(wordSearchGrid, wordsToFind);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ grid: wordSearchGrid, solutions });
});

app.listen(3030, async () => {
  console.log("Server is up on port 3030");
  page = await startUpBrowser();
});
