const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { startUpBrowser, ocr } = require("./puppeteer");

const app = express();
var upload = multer({ dest: "uploads/" });
const page = startUpBrowser();

app.all("*", upload.single("source"), async (req, res) => {
  console.log(req.file);

  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "./uploads/image.png");
  fs.rename(tempPath, targetPath, (err) => {
    if (err) console.log(err);
  });

  const ocrdata = ocr(page, targetPath);
  console.log(ocrdata);
  res.header("Access-Control-Allow-Origin", "*");
  res.send("hi");
});

app.listen(3030, async () => {
  console.log("Server is up on port 3030");
});
