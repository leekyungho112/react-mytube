import React from "react";
import { Comment, Avatar, Button, InPut } from "antd";

//const { TextArea } = InPut;

function SingleComment() {
  return (
    <div>
      <Comment actions author avatar={<Avatar src alt />} content />

      <form style={{ display: "flex" }} onSubmit>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange
          value
          placeholder="공개 댓글을 추가.."
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick>
          추가
        </button>
      </form>
    </div>
  );
}

export default SingleComment;
