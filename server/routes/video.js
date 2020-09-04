const express = require("express");
const router = express.Router();
//const { Video } = require("../models/Video");
const path = require("path");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
//destination : 파일을 올리면 어디다 저장할지 uploads 이곳에다가
//filename : 시간 뒤에 파일의 원래 이름이 붙여진다.
//fileFilter : 동영상을 업로드 하기 위해 mp4만을
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(
        res.status(400).end("jpg, png, mp4파일만 업로드 가능합니다."),
        false
      );
    }
    cb(null, true);
  },
});
const upload = multer({ storage: storage }).single("file");
//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  //비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //썸네일 생성하고 비디오 러닝타임 정보를 가져오기
  //req.body.url업로드된 비디오파일을 가져온다
  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      console.log("will generate" + filenames.json(","));
      console.log(filenames);

      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: filePath,

        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.log(err);
      return res.json({ success: false, err });
    })
    .screensshots({
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
  //screensshots count-> 3이면 3개의 썸네일을 생성
  //folder ->uploads/thumbnails 경로에 썸네일을 저장
  //
});

module.exports = router;
