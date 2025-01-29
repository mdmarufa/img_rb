const express = require("express");
const multer = require("multer");
const { removeBackground } = require("@imgly/background-removal-node");
const { unlink } = require("fs");
const app = express();
const router = express.Router();

let currentFileName = null;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const des = __dirname + "/upload";
    cb(null, des);
  },
  filename: (req, file, cb) => {
    const ms = Math.round(Math.random() * 1000) * Date.now();
    const { mimetype, originalname } = file;
    let fileName = originalname.slice(0, originalname.lastIndexOf("."));
    let ext = originalname.replace(fileName, "");
    const newFileName = fileName + ms.toString() + ext;
    currentFileName = newFileName;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

async function removeBg(imgSource) {
  try {
    const blob = await removeBackground(imgSource);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (e) {
    console.log(e);
    return false;
  }
}

app.use(express.json());

router.post("/removeBg", upload.single("img"), async (req, res, next) => {
  try {
    let fileAdd;
    let originalname = "";
    if (req.body.url) {
      fileAdd = req.body.url;
    } else {
      originalname = req.file.originalname;
      fileAdd = `./upload/${currentFileName}`;
    }
    const dataUrl = await removeBg(fileAdd);
    if (dataUrl) {
      res.status(200).send({
        img: `<img src=${dataUrl} alt=${originalname} />`,
      });
    } else {
      res.status(400).send({
        title: "This is not image or image url",
        msg: `Its look like this is not a image file or not a valid image URL. Please check and try again lager.`,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      title: "Unknow server error",
      msg: `Its look like server side error please try again.`,
    });
  } finally {
    if (!req.body.url) {
      unlink(`${__dirname}/upload/${currentFileName}`, (err) => {
        if(err) {
          console.log(err)
        }else {
          console.log(`image deleted ${currentFileName}.`)
        }
      });
    }
  }
});

app.use(router);

app.listen(3000, () => {
  console.log("The server is running at localhost:3000");
});
