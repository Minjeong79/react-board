import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../../firebase";
import { setDoc, collection, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface ReplyType {
  content: string;
  numIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
  commentId: string;
}

const userReplyComment = createAsyncThunk<
  { boardId: number; boardReplyComment: ReplyType },
  { boardId: number; boardReplyComment: ReplyType }
>("user/Replycomment", async (data, thunkAPI) => {
  try {
    const { boardId, boardReplyComment } = data;
    const { content, numIndex, commentId } = boardReplyComment;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: any = thunkAPI.getState();

    const userInformation = state.login.user;
    const userNicName = userInformation.displayName;

    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const specificDoc = await getDocs(userCollection);

    for (const [index, docI] of specificDoc.docs.entries()) {
      const dataId = docI.id;

      //하위 도큐멘트
      const docRef = doc(userCollection, dataId);

      //하위 컬렉션
      const lastCallectionRef = collection(docRef, "comment");
      const specificDocComment = await getDocs(lastCallectionRef);
      for (const [idx, iterator] of specificDocComment.docs.entries()) {
        const dataCId = iterator.id;

        const userCommentDoc = doc(lastCallectionRef, dataCId);

        const userCommentReplyCollection = collection(userCommentDoc, "reply");

        if (iterator.id) {
          const dataComment = {
            content: content,
            strIndex: numIndex,
            dataCUid: userId as string,
            timedata: new Date(),
            displayName: userNicName,
            isModified: false,
            commentId: commentId,
          };
          await setDoc(doc(userCommentReplyCollection, numIndex), dataComment);
        } else {
          console.log("대댓글 오류------------------");
        }
      }
    }

    const responseDataComment = {
      boardId: boardId,
      boardReplyComment: {
        content: content,
        numIndex: numIndex,
        dataCUid: userId as string,
        timedata: new Date(),
        displayName: userNicName,
        isModified: true,
        commentId: commentId,
      },
    };
    return responseDataComment;
  } catch (error) {
    throw error;
  }
});

export default userReplyComment;
