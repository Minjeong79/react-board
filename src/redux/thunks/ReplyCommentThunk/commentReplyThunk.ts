import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../../firebase";
import { customAlphabet } from "nanoid";
import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface CommentType {
  content: string;
  numIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
  replye: boolean;
}

const userReplyComment = createAsyncThunk<
  { boardId: number; boardReplyComment: CommentType },
  { boardId: number; boardReplyComment: CommentType }
>("user/Replycomment", async (data, thunkAPI) => {
  try {
    const { boardId, boardReplyComment } = data;
    const { content, numIndex } = boardReplyComment;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: any = thunkAPI.getState();
    const boardSelectedId = state.board.selectedBoardId;
    const strId = data.boardId.toString();
    const userNicNameList = state.login.userLists;
    const userInformation = state.login.user;
    const userNicName = userInformation.displayName;

    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, "userData");
    //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
    const subCollectionRef = collection(userDocRef, strId);
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(subCollectionRef);

    for (const [index, docI] of specificDoc.docs.entries()) {
      const data = docI.data();
      const dataId = data.did;
      const dataIndex = data.index;

      //하위 도큐멘트
      const docRef = doc(subCollectionRef, dataIndex);

      //하위 컬렉션
      const lastCallectionRef = collection(docRef, "comment");

      const lasteDocs = await getDocs(lastCallectionRef);

      //reply 컬렉션

      lasteDocs.forEach(async (reply) => {
        const replyDataId = reply.id;
        const replyData = reply.data();

        const replyRef = doc(lastCallectionRef, replyDataId);

        const replyCallectionRef = collection(replyRef, "reply");

        const dataComment = {
          content: content,
          numIndex: numIndex,
          dataCUid: userId,
          timedata: new Date(),
          displayName: userNicName,
          isModified: true,
          replye: true,
        };
        await setDoc(doc(replyCallectionRef, numIndex), dataComment);
      });
    }
    const responseDataComment = {
      boardId: boardSelectedId,
      boardReplyComment: {
        content: content,
        numIndex: numIndex,
        dataCUid: userId as string,
        timedata: new Date(),
        displayName: userNicName,
        isModified: true,
        replye: true,
      },
    };
    return responseDataComment;
  } catch (error) {
    throw error;
  }
});

export default userReplyComment;
