import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useLocation } from "react-router-dom";
import userCommentModify from "../../redux/thunks/commentThunk/commentModifiyThunk";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { RootLoginState } from "../../redux/reducer";
interface CommentType {
  content: string;
  strIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
}
const CommentModifiy = () => {
  const userCollection = collection(firestore, "users");
  const userInformation = useAppSelector((state: RootLoginState) => state.login.user);
  const userNicName = userInformation?.displayName;
  const userCommentUid = userInformation?.uid;

  const location = useLocation();
  const state = location.state;
  const boardId = state.boardId;
  const strId = boardId.toString();
  const statestrIndexId = state.strCommentIndex;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [oldComment, setOldeComment] = useState<CommentType | undefined>(
    undefined
  );
  const [content, setConent] = useState("");

  const userDocRef = doc(userCollection, strId);
  const subCollectionRef = collection(userDocRef, "comment");
  const subDocId = doc(subCollectionRef, statestrIndexId);

  const handleoldComment = async () => {
    const docSnapshot = await getDoc(subDocId);
    const data = docSnapshot.data() as CommentType;
    setOldeComment(data);
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const comment = {
        content: content,
        strIndex: oldComment ? oldComment.strIndex : "",
        dataCUid: userCommentUid,
        timedata: new Date(),
        displayName: userNicName,
        isModified: true,
      };

      await dispatch(
        userCommentModify({
          boardId: boardId,
          boardCommentModify: comment,
        })
      );

      navigate(`/page/${strId}`);
      setConent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("댓글 작성을 취소 하시겠습니까?")) {
      navigate(`/page/${strId}`);
    }
  };
  useEffect(() => {
    handleoldComment();
  }, []);

  return (
    <section className="container">
      <div className="comment_box comment_box_reply">
        <h1>댓글 수정</h1>
        <form onSubmit={handleComment}>
          <textarea
            defaultValue={oldComment?.content}
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

export default CommentModifiy;
