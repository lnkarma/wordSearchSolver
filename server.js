const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { wordSearchSolver } = require("./wordSearchSolver");
const { startUpBrowser, ocr } = require("./puppeteer");
const { parseOcrData } = require("./parseOcr");

const app = express();
var upload = multer({ dest: "uploads/originals" });
var page;

app.all("*", upload.single("source"), async (req, res) => {
  console.log(req.file);

  const imageName = `image${Date.now()}.png`;
  const tempPath = req.file.path;
  // const originalPath = path.join(__dirname, `./uploads/originals/${imageName}`);
  const targetPath = path.join(__dirname, `./uploads/cropped/${imageName}`);
  await fs.renameSync(tempPath, targetPath);

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
