const express = require("express");
const { createCanvas, Image } = require("canvas");
const cors = require("cors");
const fs = require("fs");

const path = require("path");
const app = express();
app.use(cors());
/*parse body*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  /** first get the quote and the color requested by the client */
  const { text, fill } = req.body;
  /**create the canvas*/
  const width = 1000;
  const height = 500;

  const canvas = createCanvas(width, height);
  /**retrieve context*/
  const ctx = canvas.getContext("2d");

  /**Create a solid black black background*/
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  /**function for wrapping text to prevernt overflow*/
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    let fontSize = "";
    /*determine fontSize depending on the character number*/
    fontSize = maxWidth / ctx.measureText(text).width;
    if (ctx.measureText(text).width > 100) {
      ctx.font = `italic bold ${20 + fontSize}pt Lato`;
    } else {
      ctx.font = `italic bold ${30 + fontSize}pt Lato`;
    }
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  /*add text to the background*/
  ctx.fillStyle = fill;
  ctx.textAlign = "center";
  wrapText(ctx, text, width / 2, height / 2, 500, 30);
  const buffer = canvas.toBuffer("image/png");
  const imageUrl = Math.floor(Math.random() * 10000) + 2;
  fs.writeFileSync(`./uploads/image${imageUrl}.png`, buffer);
  res.status(200).json({
    src: `uploads/image${imageUrl}.png`,
  });
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}...`);
});
