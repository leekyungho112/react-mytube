const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscriber
//=================================

router.post("/subscribeNumber", (req, res) => {
  // exex에 subscribe은 userTo에 모든 케이스가 들어있다.
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post("/subscribed", (req, res) => {
  //subscribed.length = 0 이면 구독이 아닌상태 그렇지 않다면 구독을 한상태로
  //false일때는 구독 X true일때는 구독

  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribed) => {
    if (err) return res.status(400).send(err);
    let result = false;
    if (subscribed.length !== 0) {
      result = true;
    }
    res.status(200).json({ success: true, subscribed });
  });
});

router.post("/unSubscribe", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});
router.post("/subscribe", (req, res) => {
  //userTo와 userFrom을 저장
  const subscribe = new Subscriber(req.body);
  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
