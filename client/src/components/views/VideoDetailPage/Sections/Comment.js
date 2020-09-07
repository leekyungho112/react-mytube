import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState("");

  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };
    Axios.post("/api/comment/saveComment", variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
      } else {
        alert("댓글 저장에 실패 했습니다.");
      }
    });
  };
  return (
    <div>
      <br />
      <p> 댓글 보기</p>
      <hr />

      {/* Comment Lists */}
      <SingleComment />

      {/*Root Comment Form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="공개 댓글을 추가.."
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          추가
        </button>
      </form>
    </div>
  );
}

export default Comment;
