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
}

const userCommentModify = createAsyncThunk<
  { boardId: number; boardCommentModify: CommentType; stateInd: number },
  { boardId: number; boardCommentModify: CommentType; stateInd: number }
>("user/commentModify", async (data, thunkAPI) => {
  try {
    const { boardId, boardCommentModify, stateInd } = data;
    const { content, numIndex } = boardCommentModify;
    console.log(stateInd);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: any = thunkAPI.getState();

    const strId = data.boardId.toString();

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

      if (boardId === dataId) {
        // const underSetDoc = doc(lastCallectionRef, userId as string);

        const dataComment = {
          content: content,
          numIndex: numIndex,
          dataCUid: userId,
          timedata: new Date(),
          displayName: userNicName,
          isModified: true,
        };

        await setDoc(doc(lastCallectionRef, numIndex), dataComment);
      } else {
        console.log("댓글 오류------------------");
      }
    }
    const responseDataComment = {
      boardId: boardId,
      boardCommentModify: {
        content: content,
        numIndex: numIndex,
        dataCUid: userId as string,
        timedata: new Date(),
        displayName: userNicName,
        isModified: true,
      },
      stateInd: stateInd,
    };
    return responseDataComment;
  } catch (error) {
    throw error;
  }
});

export default userCommentModify;
