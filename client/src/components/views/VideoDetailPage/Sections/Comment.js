import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import { Button, Input } from "antd";
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

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
        setCommentValue("");
        props.refreshFunction(res.data.result);
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
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={comment._id}>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  key={index}
                  comment={comment}
                  postId={props.postId}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  commentLists={props.commentLists}
                  postId={props.postId}
                />
              </React.Fragment>
            )
        )}

      {/*Root Comment Form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="공개 댓글을 추가.."
        />
        <br />
        <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          추가
        </Button>
      </form>
    </div>
  );
}

export default Comment;
