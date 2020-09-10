import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [DisLikes, setDisLikes] = useState(0);
  const [LikesAction, setLikesAction] = useState(null);
  const [DisLikesAction, setDisLikesAction] = useState(null);
  let variables = {};

  if (props.video) {
    variables = {
      videoId: props.videoId,
      userId: props.userId,
    };
  } else {
    variables = { commentId: props.commentId, userId: props.userId };
  }
  useEffect(() => {
    Axios.post("/api/like/getLikes", variables).then((res) => {
      if (res.data.success) {
        console.log("getLikes", res.data.likes);
        // 얼마나 많은 좋아요를 받았는지
        setLikes(res.data.likes.length);
        // 이미 그 좋아요를 눌렀는지
        res.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikesAction("liked");
          }
        });
      } else {
        alert("Likes에 정보를 읽어오지 못했습니다.");
      }
    });

    Axios.post("/api/like/getDislikes", variables).then((res) => {
      console.log("getDislike", res.data);
      if (res.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDisLikes(res.data.dislikes.length);
        // 이미 그 싫어요를 눌렀는지
        res.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikesAction("disliked");
          }
        });
      } else {
        alert("disliked에 정보를 읽어오지 못했습니다.");
      }
    });
  }, []);

  const onLike = () => {
    // 좋아요 버튼이 아직 클릭이 안되어 있을때
    if (LikesAction === null) {
      Axios.post("/api/like/upLike", variables).then((res) => {
        if (res.data.success) {
          setLikes(Likes + 1);
          setLikesAction("liked");
          if (DisLikesAction !== null) {
            setDisLikesAction(null);
            setDisLikes(DisLikes - 1);
          }
        } else {
          alert("좋아요를 올리지 못했습니다.");
        }
      });
    } else {
      //좋아요 버튼이 클릭이 되어있을때
      Axios.post("/api/like/unLike", variables).then((res) => {
        if (res.data.success) {
          setLikes(Likes - 1);
          setLikesAction(null);
        } else {
          alert("좋아요를 내리지 못했습니다.");
        }
      });
    }
  };

  const onDisLike = () => {
    //싫어요가 클릭이 이미 되어있을때
    if (DisLikesAction !== null) {
      Axios.post("/api/like/unDislike", variables).then((res) => {
        if (res.data.success) {
          setDisLikes(DisLikes - 1);
          setDisLikesAction(null);
        } else {
          alert("싫어요를 지우지 못했습니다.");
        }
      });
    } else {
      //클릭 되어 있지 않을때

      Axios.post("/api/like/upDislike", variables).then((res) => {
        if (res.data.success) {
          setDisLikes(DisLikes + 1);
          setDisLikesAction("disliked");

          if (LikesAction !== null) {
            setLikesAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("싫어요를 지우지 못했습니다.");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikesAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {Likes} </span>
      </span>

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DisLikesAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {DisLikes} </span>
      </span>
    </div>
  );
}

export default LikeDislikes;
