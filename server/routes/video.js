const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const path = require("path");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require("../models/Subscriber");
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

router.post("/uploadViedo", (req, res) => {
  //비디오정보를 저장한다.
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다

  //비디오 컬렉션에 있는 모든 비디오를 가져온다.
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

//구독페이지 비디오 가져오기
router.post("/getSubscriptionVideos", (req, res) => {
  //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      let subscribedUser = [];

      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });
      //찾은 구독자의 비디오를 가지고온다.
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

router.post("/getVideoDetail", (req, res) => {
  // 아이디를 이용해서 그에 맞는 DB에 있는 정보를 가져온다
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      console.log(videoDetail);
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videoDetail });
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
    .screenshots({
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
