import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "../../firebase";

import { useLocation } from "react-router-dom";
import { customAlphabet } from "nanoid";
import { getAuth } from "firebase/auth";
import userReplyComment from "../../redux/thunks/ReplyCommentThunk/commentReplyThunk";
const ReplyComment = () => {
  //댓글 내용
  const [content, setConent] = useState("");

  const nanoid = customAlphabet("123456789", 6);
  const numid = nanoid();

  const numidStr = numid.toString();

  //사용자 정보
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const selectedBoardId = useSelector(
    (state: any) => state.board.selectedBoardId
  );

  const userCommentList = useSelector(
    (state: any) => state.boardPageComment.boardComment
  );

  const userInformation = useSelector((state: any) => state.login.user);
  const userNicName = userInformation.displayName;

  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state;
  const stateInd = state.commentInd;

  const dispatch = useDispatch();
  const handleComment = async (e: any) => {
    e.preventDefault();

    // if (!!content) {
    //   window.confirm("댓글 내용을 입력 해주세요");
    //   return;
    // }

    const comment = {
      content: content,
      numIndex: numidStr,
      dataCUid: userId as string,
      timedata: new Date(),
      displayName: userNicName,
      isModified: false,
      replye: false,
    };

    await dispatch(
      userReplyComment({
        boardId: selectedBoardId,
        boardReplyComment: comment,
      }) as any
    );
    navigate(`/page/${selectedBoardId}`);
    setConent("");
  };

  const handleCancel = () => {
    if (window.confirm("댓글 작성을 취소 하시겠습니까?")) {
      navigate(`/page/${selectedBoardId}`);
    }
  };
  return (
    <section className="container">
      <div className="comment_box">
        <form onSubmit={handleComment}>
          <textarea
            value={content}
            maxLength={300}
            onChange={(e) => {
              setConent(e.target.value);
            }}
            placeholder="내용을 입력 해주세요"
          />
          <div className="center_mt">
            <input type="submit" value="등록" />
            <input type="button" value="취소" onClick={handleCancel} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReplyComment;
