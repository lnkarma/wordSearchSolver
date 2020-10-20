const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { wordSearchSolver } = require("./wordSearchSolver");
const { startUpBrowser, ocr } = require("./puppeteer");
const { parseOcrData } = require("./parseOcr");

const port = process.env.PORT || 3030;

const app = express();
var upload = multer({ dest: "../uploads/originals" });
var page;

const publicPath = path.join(__dirname, `../public`);
app.use("/static", express.static(publicPath));

app.all("*", upload.single("source"), async (req, res) => {
  if (!req.file) {
    res.send("send an image to parse");
    return;
  }
  // console.log(req.file);

  const imageName = `image.png`;
  // const imageName = `image${Date.now()}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../uploads/${imageName}`);
  // const testPath = path.join(__dirname, `../image1602820376259.png`);
  await fs.renameSync(tempPath, targetPath);

  // const ocrdata = await ocr(page, testPath);
  const ocrdata = await ocr(page, targetPath);
  // console.log(ocrdata);
  const { wordSearchGrid, wordsToFind } = parseOcrData(ocrdata);
  // console.log(wordSearchGrid);
  const solutions = wordSearchSolver(wordSearchGrid, wordsToFind);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ grid: wordSearchGrid, solutions });
});

app.listen(port, async () => {
  console.log(`Server is up on port ${port}`);
  page = await startUpBrowser();
});
