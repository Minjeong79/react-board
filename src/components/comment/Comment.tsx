import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userComment from "../../redux/thunks/commentThunk/commentNewThunk";
import deleteComment from "../../redux/thunks/commentThunk/commentDeleteThunk";
import { customAlphabet } from "nanoid";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { firebaseApp, firestore } from "../../firebase";

const Comment = (props: any) => {
  //댓글 내용
  const [content, setConent] = useState("");
  //댓글 총 수
  const [repCount, setRepCount] = useState("");

  const boardId = props.boardId;

  const nanoid = customAlphabet("123456789", 6);
  const numid = nanoid();
  const numidStr = numid.toString();

  const dispatch = useDispatch();

  const userInformation = useSelector((state: any) => state.login.user);
  const userNicName = userInformation.displayName;
  const userCommentUid = userInformation.uid;

  const userinputComments = useSelector(
    (state: any) => state.boardPageComment.boardComment
  );

  const userCommentModifyList = useSelector(
    (state: any) => state.boardPageCommentModifiy.boardCommentModify
  );

  const comeentReplyList = useSelector(
    (state: any) => state.boardPageRepplyComment?.boardReplyComment
  );
  // console.log(comeentReplyList);
  const handleComment = async (e: any) => {
    e.preventDefault();

    if (!content) {
      window.confirm("댓글 내용을 입력 해주세요");
      return;
    }

    const comment = {
      content: content,
      numIndex: numidStr,
      dataCUid: userCommentUid,
      timedata: new Date(),
      displayName: userNicName,
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

  //댓글 데이터
  const objectComment = Object.values(props);

  const userCollection = collection(firestore, "users");
  const userDocRef = doc(userCollection, "userData");
  const subCollectionRef = collection(userDocRef, boardId.toString());

  const handleCommentDelete = async (numIndexToDelete: string) => {
    const confirmDelete = window.confirm("삭제 하시 겠습니까?");
    if (!confirmDelete) {
      return;
    }

    const specificDoc = await getDocs(subCollectionRef);

    for (const [index, docI] of specificDoc.docs.entries()) {
      const data = docI.data();
      const dataIndex = data.index;

      const docRef = doc(subCollectionRef, dataIndex);
      const lastCallectionRef = collection(docRef, "comment");
      const commentDoc = await getDocs(lastCallectionRef);

      for (const [index, docC] of commentDoc.docs.entries()) {
        const dataC = docC.data();
        const dataIndex = dataC.numIndex;

        try {
          const foundComment = userinputComments[boardId]?.find(
            (e: any) =>
              e.numIndex === dataIndex && e.dataCUid === userCommentUid
          );
          console.log(foundComment);
          if (foundComment) {
            dispatch(
              deleteComment({
                boardId: boardId,
                dataCUid: userCommentUid || "",
                numIndex: numIndexToDelete,
              }) as any
            );
          }
        } catch (error) {}
      }
    }
  };

  //댓글 총 수
  const commentCount: any = objectComment[0];

  const dataListPage = async () => {
    const specificDoc = await getDocs(subCollectionRef);

    specificDoc.docs.map(async (iData) => {
      const data = iData.data();
      const dataUserId = data.index;
      const docRef = doc(subCollectionRef, dataUserId);

      const lastCallectionRef = collection(docRef, "comment");

      const lasteDocs = await getDocs(lastCallectionRef);

      lasteDocs.forEach(async (reply) => {
        const replyDataId = reply.id;

        const replyRef = doc(lastCallectionRef, replyDataId);

        const replyCallectionRef = collection(replyRef, "reply");

        const replyDocs = await getDocs(lastCallectionRef);

        replyDocs.forEach((replyD) => {
          const replyId = replyD.id;
          setRepCount(replyId);
        });
      });
    });
  };

  useEffect(() => {
    dataListPage();
  });

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
          <p>댓글 수 {commentCount?.length}</p>
          <ul>
            {objectComment.map((items: any, index: number) =>
              Array.isArray(items) && items.length > 0 ? (
                items.map((item: any, innerIndex: number) => {
                  const commentModiIdx =
                    userCommentModifyList[index]?.length - 1;

                  const modifiyLastDb =
                    userCommentModifyList?.[boardId]?.[innerIndex]?.[index];

                  const commentModifyList = modifiyLastDb?.isModified;

                  //리댓
                  const comeentReplyDatat =
                    comeentReplyList[boardId]?.[innerIndex]?.content;

                  const comeentReplyDataReplye =
                    comeentReplyList[boardId]?.[innerIndex]?.replye;

                  const commentDate = new Date(item?.timedata);
                  const year = commentDate.getFullYear();
                  const month = commentDate.getMonth() + 1;
                  const date = commentDate.getDate();
                  const userDate = `${year}.${month}.${date}`;

                  const propsDb = { commentInd: innerIndex, boardId: boardId };

                  if (commentModifyList === true) {
                    return (
                      <li key={innerIndex}>
                        <span>{item?.displayName} </span>
                        <span>{userDate}</span>
                        <div>내용 : {modifiyLastDb.content}</div>
                        <div className="comment_reply">
                          답글 :{comeentReplyDatat}
                        </div>
                        <div className="comment_txt">
                          {userCommentUid === item?.dataCUid ? (
                            <div className="comment_btn">
                              {comeentReplyDataReplye === true ? (
                                <div></div>
                              ) : (
                                <Link
                                  to={`/replyComment/${index}`}
                                  state={{ commentInd: index }}
                                >
                                  댓글
                                </Link>
                              )}
                              <div className="edit_btn">
                                <Link
                                  to={`/CommentModifiy/${innerIndex}`}
                                  state={propsDb}
                                >
                                  수정
                                </Link>
                              </div>
                              <input
                                type="button"
                                onClick={() =>
                                  handleCommentDelete(item.numIndex)
                                }
                                value="삭제"
                              />
                            </div>
                          ) : (
                            <div className="comment_btn">
                              <input type="submit" value="댓글" />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  } else {
                    return (
                      <li key={innerIndex}>
                        <span>{item.displayName} </span>
                        <span>{userDate}</span>
                        <div>{item.content}</div>
                        <div>답글 :{comeentReplyDatat}</div>
                        <div className="comment_txt">
                          {userCommentUid === item.dataCUid ? (
                            <div className="comment_btn">
                              {comeentReplyDataReplye === true ? (
                                <div></div>
                              ) : (
                                <Link
                                  to={`/replyComment/${index}`}
                                  state={{ commentInd: index }}
                                >
                                  댓글
                                </Link>
                              )}

                              <div className="edit_btn">
                                <Link
                                  to={`/CommentModifiy/${innerIndex}`}
                                  state={propsDb}
                                >
                                  수정
                                </Link>
                              </div>
                              <input
                                type="button"
                                onClick={() =>
                                  handleCommentDelete(item.numIndex)
                                }
                                value="삭제"
                              />
                            </div>
                          ) : (
                            <div className="comment_btn">
                              <input type="submit" value="댓글" />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  }
                })
              ) : (
                <div></div>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Comment;
