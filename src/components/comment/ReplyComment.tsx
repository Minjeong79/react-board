import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { customAlphabet } from "nanoid";
import userReplyComment from "../../redux/thunks/ReplyCommentThunk/commentReplyThunk";
const ReplyComment = () => {
  const userInformation = useSelector((state: any) => state.login.user);
  const userNicName = userInformation.displayName;
  const userCommentUid = userInformation?.uid;

  const location = useLocation();
  const state = location.state;
  const boardId = state.boardId;
  const statestrIndexId = state.strCommentIndex;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nanoid = customAlphabet("123456789", 6);
  const numid = nanoid();
  const numidStr = numid.toString();

  const [content, setConent] = useState("");

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = {
      content: content,
      numIndex: numidStr,
      dataCUid: userCommentUid as string,
      timedata: new Date(),
      displayName: userNicName,
      isModified: false,
      commentId: statestrIndexId,
    };
    await dispatch(
      userReplyComment({
        boardId: statestrIndexId,
        boardReplyComment: comment,
      }) as any
    );
    navigate(`/page/${boardId}`);
    setConent("");
  };

  const handleCancel = () => {
    if (window.confirm("댓글 작성을 취소 하시겠습니까?")) {
      navigate(`/page/${boardId}`);
    }
  };
  return (
    <section className="container">
      <div className="comment_box comment_box_reply">
        <h1>대댓글 등록</h1>
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
