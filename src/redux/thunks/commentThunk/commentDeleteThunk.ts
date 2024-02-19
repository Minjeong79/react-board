import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../../firebase";
import { getAuth } from "firebase/auth";

const deleteComment = createAsyncThunk<
  { boardId: number; dataCUid: string; strIndex: string },
  { boardId: number; dataCUid: string; strIndex: string }
>("user/commentDelete", async (data, thunkAPI) => {
  const { boardId, dataCUid, strIndex } = data;

  const strId = boardId.toString();
 
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  //컬렉션
  const userCollection = collection(firestore, "users");
  //도큐멘트
  const userDocRef = doc(userCollection, strId);
   //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
  const subCollectionRef = collection(userDocRef, "comment");
  //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
  const specificDoc = doc(subCollectionRef, strIndex);

  await deleteDoc(specificDoc);

  const responseData = {
    boardId: boardId,
    dataCUid: userId || "",
    strIndex: strIndex,
  };
  return responseData;
});

export default deleteComment;
