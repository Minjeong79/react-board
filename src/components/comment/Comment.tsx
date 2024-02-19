import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userComment from "../../redux/thunks/commentThunk/commentNewThunk";
import deleteComment from "../../redux/thunks/commentThunk/commentDeleteThunk";
import { customAlphabet } from "nanoid";
import { collection, getDocs, doc } from "firebase/firestore";
import { firestore, appAuth } from "../../firebase";

interface CommentType {
  content: string;
  strIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
}
interface ReplyTypeS {
  content: string;
  strIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
  commentId: string;
}
interface CommentProps {
  boardId: number;
}
const Comment = (props: CommentProps) => {
  const userCollection = collection(firestore, "users");

  const auth = appAuth;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;
  const displayName = currentUser?.displayName;

  const boardId = props.boardId;
  const strId = boardId.toString();
  const nanoid = customAlphabet("0123456789", 9);
  const numid = nanoid();
  const dispatch = useDispatch();

  const [strIndex, setStrIndex] = useState("");
  const [content, setConent] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [commentData, setCommentData] = useState<CommentType[]>([]);
  const [replyList, setRepluList] = useState<ReplyTypeS[]>([]);

  const handleId = () => {
    setStrIndex(numid);
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content) {
      window.confirm("댓글 내용을 입력 해주세요");
      return;
    }
    const comment = {
      content: content,
      strIndex: strIndex,
      dataCUid: userId as string,
      timedata: new Date(),
      displayName: displayName as string,
      isModified: false,
    };
    await dispatch(
      userComment({
        boardId: boardId,
        boardComment: comment,
      }) as any
    );
    setConent("");
  };

  const userDocRef = doc(userCollection, strId);
  const subCollectionRef = collection(userDocRef, "comment");

  const handleCommentDelete = async (strIndexToDelete: string) => {
    window.confirm("삭제 하시 겠습니까?");
    try {
      dispatch(
        deleteComment({
          boardId: boardId,
          dataCUid: userId as string,
          strIndex: strIndexToDelete,
        }) as any
      );
      dataListPage();
      replyData();
    } catch (error) {
      console.log(error);
    }
  };

  const dataListPage = async () => {
    const specificDoc = await getDocs(subCollectionRef);
    setCommentCount(specificDoc.size);

    const comments: CommentType[] = specificDoc.docs.map((docI) => {
      const data = docI.data();
      // 데이터를 CommentType 형식으로 매핑
      return {
        content: data.content,
        strIndex: data.strIndex,
        dataCUid: data.dataCUid,
        timedata: data.timedata.toDate(), // Firestore에서의 Date 타입을 JavaScript Date 객체로 변환
        displayName: data.displayName,
        isModified: data.isModified,
      };
    });
    setCommentData(comments);
  };

  const replyData = async () => {
    const specificDoc = await getDocs(subCollectionRef);
    specificDoc.docs.map(async (docI) => {
      const userDocComment = doc(subCollectionRef, docI.id);
      const replyCollectionRef = collection(userDocComment, "reply");

      const repldycDoc = await getDocs(replyCollectionRef);
      const replydata: ReplyTypeS[] = repldycDoc.docs.map((item) => {
        const data = item.data();
        return {
          content: data.content,
          strIndex: data.strIndex,
          dataCUid: data.dataCUid,
          timedata: data.timedata.toDate(), // Firestore에서의 Date 타입을 JavaScript Date 객체로 변환
          displayName: data.displayName,
          isModified: data.isModified,
          commentId: data.commentId,
        };
      });
      setRepluList(replydata);
    });
  };

  useEffect(() => {
    dataListPage();
    handleId();
    replyData();
  }, [content, commentCount]);

  console.log(commentData);
  return (
    <section className="comment_box">
      <form onSubmit={handleComment}>
        <textarea
          value={content}
          maxLength={300}
          onChange={(e) => {
            setConent(e.target.value);
          }}
          placeholder="내용을 입력 해주세요"
        />
        <input type="submit" value="등록" />
      </form>

      <div className="comment_view">
        <div className="comment_user">
          <p>댓글 수 {commentCount}</p>
          <ul>
            {commentData.map((item, index) => {
              const propsDb = {
                boardId: boardId,
                strCommentIndex: item.strIndex,
              };

              const filteredReplyList = replyList.filter(
                (it) => item.strIndex === it.commentId
              );

              return (
                <li key={index}>
                  <span>닉네임 : {item.displayName} </span>
                  <span>
                    날짜
                    {item.timedata.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <div>내용 : {item.content}</div>
                  <div className="comment_txt">
                    <div className="comment_btn">
                      <div className="comment_btn_box">
                        {filteredReplyList.length === 0 ? (
                          <Link
                            className="addReply"
                            to={`/replyComment/${item.strIndex}`}
                            state={propsDb}
                          >
                            댓글
                          </Link>
                        ) : (
                          filteredReplyList.map((it, index) => (
                            <div key={index}>
                              <div>{it.content}</div>
                            </div>
                          ))
                        )}
                        {userId === item.dataCUid ? (
                          <>
                            <div className="edit_btn">
                              <Link
                                to={`/CommentModifiy/${item.strIndex}`}
                                state={propsDb}
                              >
                                수정
                              </Link>
                            </div>
                            <input
                              type="button"
                              onClick={() => handleCommentDelete(item.strIndex)}
                              value="삭제"
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Comment;
