import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import userCommentModify from "../../redux/thunks/commentThunk/commentModifiyThunk";
import { useLocation } from "react-router-dom";

const CommentModifiy = (props: any) => {
  //댓글 내용
  const [content, setConent] = useState("");
  const location = useLocation();
  const state = location.state;
  const stateInd = state.commentInd;
  const stateboardId = state.boardId;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //수정전
  const userCommentList = useSelector(
    (state: any) => state.boardPageComment.boardComment
  );

  //수정 후
  const userCommentModifyList = useSelector(
    (state: any) => state.boardPageCommentModifiy.boardCommentModify
  );

  const pickComment = userCommentList[stateboardId][stateInd];
  const numidStr = pickComment.numIndex;
  const dataCUid = pickComment.dataCUid;
  const userNicName = pickComment.displayName;
  const userModify = pickComment.isModified;

  const modifyindex = userCommentModifyList[stateboardId]?.length - 1;
  const lastModify = userCommentModifyList[stateboardId][stateInd];
  // console.log(userModify);
  console.log(lastModify);

  const handleComment = async (e: any) => {
    e.preventDefault();

    const comment = {
      content: content,
      numIndex: numidStr,
      dataCUid: dataCUid,
      timedata: new Date(),
      displayName: userNicName,
      isModified: true,
    };

    await dispatch(
      userCommentModify({
        boardId: stateboardId,
        boardCommentModify: comment,
        stateInd: stateInd,
      }) as any
    );
    navigate(`/page/${stateboardId}`);
    setConent("");
  };

  const handleCancel = () => {
    if (window.confirm("댓글 작성을 취소 하시겠습니까?")) {
      navigate(`/page/${stateboardId}`);
    }
  };
  // console.log(pickComment);
  // console.log(pickComment);
  console.log(lastModify[0]?.isModified);
  return (
    <section className="container">
      <div className="comment_box">
        <form onSubmit={handleComment}>
          {lastModify[0]?.isModified === true ? (
            <textarea
              defaultValue={lastModify[0]?.content}
              maxLength={300}
              onChange={(e) => {
                setConent(e.target.value);
              }}
              placeholder="내용을 입력 해주세요sss"
            />
          ) : (
            <textarea
              defaultValue={pickComment?.content}
              maxLength={300}
              onChange={(e) => {
                setConent(e.target.value);
              }}
              placeholder="내용을 입력 해주세요"
            />
          )}

          <div className="center_mt">
            <input type="submit" value="등록" />
            <input type="button" value="취소" onClick={handleCancel} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default CommentModifiy;
