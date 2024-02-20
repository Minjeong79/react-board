import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../../firebase";
import {
  setDoc,
  collection,
  getDocs,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { RootLoginState } from "../../reducer";

interface CommentType {
  content: string;
  strIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
}

const userComment = createAsyncThunk<
  { boardId: number; boardComment: CommentType },
  { boardId: number; boardComment: CommentType }
>("user/comment", async (data, thunkAPI) => {
  try {
    const { boardId, boardComment } = data;
    const { content, strIndex } = boardComment;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: RootLoginState = thunkAPI.getState() as RootLoginState;

    const userInformation = state.login.user;
    const userNicName = userInformation.displayName;

    //컬렉션
    const userCollection = collection(firestore, "users");
    //하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(userCollection);

    for (const [index, docI] of specificDoc.docs.entries()) {
      const dataId = docI.id;
      const numberId = Number(dataId);
      
      //하위 도큐멘트
      const docRef = doc(userCollection, dataId);

      //하위 컬렉션
      const lastCallectionRef = collection(docRef, "comment");

      if (boardId === numberId) {
        const dataComment = {
          content: content,
          strIndex: strIndex,
          dataCUid: userId as string,
          timedata: new Date(),
          displayName: userNicName,
          isModified: false,
        };

        await setDoc(doc(lastCallectionRef, strIndex), dataComment);
        break;
      } else {
        console.log("댓글 오류------------------");
      }
    }
    const responseDataComment = {
      boardId: boardId,
      boardComment: {
        content: content,
        strIndex: strIndex,
        dataCUid: userId as string,
        timedata: new Date(),
        displayName: userNicName,
        isModified: false,
      },
    };
    return responseDataComment;
  } catch (error) {
    throw error;
  }
});

export default userComment;
