const puppeteer = require("puppeteer");

// // await page.click(
// //   "#main > section.section.section-size2 > div:nth-child(4) > div > div.owl-stage-outer > div > div:nth-child(5) > button"
// // );
// await page.waitForSelector("#detectTextPreview > div > p");

// const ocrData = await page.evaluate(
//   () => document.querySelector("#detectTextPreview > div").innerText
// );

// console.log(ocrData);
// //   const fileUploadElement = await page.$(
// //     "#vision-ocr2 > ul > li:nth-child(2) > input[type=file]"
// //   );

// const dataElement = await page.$("#detectTextPreview > div");

// //   console.log(dataElement.);

// //   fileUploadElement.uploadFile("image.jpg");
async function startUpBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  loadOcrSite(page);
  return page;
}

async function loadOcrSite(page) {
  await page.goto(
    "https://azure.microsoft.com/en-in/services/cognitive-services/computer-vision/#vision-analysis_tab1",
    {
      waitUntil: "load",
      timeout: 0,
    }
  );

  await page.click("#vision-analysis_tab2");
  await page.click("#vision-analysis2 > ul > li:nth-child(1) > select");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press(String.fromCharCode(13));
}

async function ocr(page, imageFile) {
  //   await page.click("#vision-analysis_tab2");
  //   await page.click("#vision-analysis2 > ul > li:nth-child(1) > select");
  //   await page.keyboard.press("ArrowDown");
  //   await page.keyboard.press("ArrowDown");
  //   await page.keyboard.press(String.fromCharCode(13));
  //   await page.click(
  //     "#main > section.section.section-size2 > div:nth-child(4) > div > div.owl-stage-outer > div > div:nth-child(5) > button"
  //   );

  const fileUploadElement = await page.$(
    "#vision-ocr2 > ul > li:nth-child(2) > input[type=file]"
  );
  fileUploadElement.uploadFile("image.jpg");

  await page.waitForSelector("#detectTextPreview > div > p");

  const ocrData = await page.evaluate(
    () => document.querySelector("#detectTextPreview > div").innerText
  );
  loadOcrSite(page);

  return ocrData;
}

module.exports = {
  startUpBrowser,
  loadOcrSite,
  ocr,
};
