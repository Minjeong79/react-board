import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../../firebase";
import { setDoc, collection, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface FirebaseUser {
  uid:string;
  email: string;
  displayName: string;
}

interface CommentType {
  content: string;
  strIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
}

const userCommentModify = createAsyncThunk<
  { boardId: number; boardCommentModify: CommentType },
  { boardId: number; boardCommentModify: CommentType }
>("user/commentModify", async (data, thunkAPI) => {
  try {
    const { boardId, boardCommentModify } = data;
    const { content, strIndex } = boardCommentModify;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state:any = thunkAPI.getState();
console.log(state);
    const strId = data.boardId.toString();

    const userInformation = state.login.user;
    const userNicName = userInformation.displayName;

    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, strId);
    //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
    const subCollectionRef = collection(userDocRef, "comment");

    const dataComment = {
      content: content,
      strIndex: strIndex,
      dataCUid: userId,
      timedata: new Date(),
      displayName: userNicName,
      isModified: true,
    };

    await setDoc(doc(subCollectionRef, strIndex), dataComment);

    const responseDataComment = {
      boardId: boardId,
      boardCommentModify: {
        content: content,
        strIndex: strIndex,
        dataCUid: userId as string,
        timedata: new Date(),
        displayName: userNicName,
        isModified: true,
      },
    };
    return responseDataComment;
  } catch (error) {
    throw error;
  }
});

export default userCommentModify;
