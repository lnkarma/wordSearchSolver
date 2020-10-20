(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  // var width = 1280; // We will scale the photo width to this
  // var height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
      .getUserMedia({
        video: {
          optional: [
            { minWidth: 320 },
            { minWidth: 640 },
            { minWidth: 800 },
            { minWidth: 900 },
            { minWidth: 1024 },
            { minWidth: 1280 },
            { minWidth: 1920 },
            { minWidth: 2560 },
          ],
        },
        audio: false,
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener(
      "canplay",
      function (ev) {
        if (!streaming) {
          // height = video.videoHeight / (video.videoWidth / width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          // if (isNaN(height)) {
          //   height = width / (4 / 3);
          // }

          // video.setAttribute("width", width);
          // video.setAttribute("height", height);
          canvas.setAttribute("width", video.videoWidth / 2);
          canvas.setAttribute("height", video.videoHeight);
          console.log(canvas.width, canvas.height);
          streaming = true;
          clearphoto();
        }
      },
      false
    );

    startbutton.addEventListener(
      "click",
      function (ev) {
        takepicture();
        ev.preventDefault();
      },
      false
    );
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    console.log(canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    // photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext("2d");
    const { videoWidth, videoHeight } = video;
    if (videoWidth && videoHeight) {
      // canvas.width = videoWidth / 2;
      // canvas.height = videoHeight;
      console.log(canvas.width, canvas.height);
      context.drawImage(
        video,
        videoWidth / 4,
        0,
        videoWidth / 2,
        videoHeight,
        0,
        0,
        videoWidth / 2,
        videoHeight
      );

      var data = canvas.toDataURL("image/png");

      var blob = b64toBlob(data);

      var formData = new FormData();
      formData.append("source", blob);

      fetch("http://localhost:3030", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          drwaWordSearch(data);
        })
        .catch((error) => console.log(error));
      const app = document.getElementById("app");
      app.innerHTML = "";
      // photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);
})();

function b64toBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
}

function drwaWordSearch({ grid, solutions }) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.style.position = "relative";
  createGrid([10, 10], grid);

  solutions.forEach((solution) => {
    app.appendChild(createSolution(solution.start, solution.end));
  });
  // app.appendChild(createSolution([0, 9], [9, 0]));
  // app.appendChild(createSolution([2, 9], [9, 2]));
  // app.appendChild(createSolution([9, 2], [2, 9]));
}

function createGrid([height, width], grid) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      app.appendChild(createCell(grid[i][j]));
    }
    app.innerHTML += "<br>";
  }
}

function createCell(innerText) {
  const cell = document.createElement("div");
  cell.style.backgroundColor = "";
  cell.style.width = "50px";
  cell.style.height = "50px";
  cell.style.display = "inline-block";
  cell.style.textAlign = "center";
  cell.style.verticalAlign = "middle";
  cell.style.lineHeight = "50px";
  cell.style.border = "1px solid black";
  const text = document.createTextNode(innerText);
  cell.appendChild(text);
  return cell;
}

function createSolution(startingPositon, endingPosition) {
  const sol = document.createElement("div");
  sol.style.position = "absolute";
  sol.style.borderRadius = "30px";
  sol.style.height = "50px";
  sol.style.backgroundImage =
    "linear-gradient(to right, rgba(0, 255, 0, 0.5) , rgba(0, 2, 255, 0.5))";

  const [startingX, startingY] = startingPositon;
  const [endingX, endingY] = endingPosition;
  const differenceX = endingX - startingX;
  const differenceY = endingY - startingY;

  const differenceXvalue = differenceX > 1 ? "a" : differenceX < 0 ? "b" : "c";
  const differenceYvalue = differenceY > 1 ? "d" : differenceY < 0 ? "e" : "f";

  const rotationAngles = {
    af: 0,
    ad: 45,
    cd: 90,
    bd: 135,
    bf: 180,
    be: 225,
    ce: 270,
    ae: 315,
  };

  sol.style.left = 50 * startingX + "px";
  sol.style.top = 50 * startingY + "px";

  const rotationAngle = rotationAngles[differenceXvalue + differenceYvalue];

  sol.style.transform = `rotate(${rotationAngle}deg)`;
  sol.style.transformOrigin = "25px center";

  // Calculate the width of the solution div
  const maxDifference = Math.max(Math.abs(differenceY), Math.abs(differenceX));
  const widthMultiplier =
    rotationAngle % 90 !== 0 ? Math.sqrt(50 * 50 + 50 * 50) : 50;
  const width = widthMultiplier * maxDifference + 50;

  sol.style.width = width + "px";

  return sol;
}
