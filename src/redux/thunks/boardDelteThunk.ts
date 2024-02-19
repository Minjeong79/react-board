import { createAsyncThunk } from "@reduxjs/toolkit";

//파이어베이스 데이터 삭제
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { getAuth } from "firebase/auth";

//state에서 데이터 삭제 하기 위해 연동
import { deleteBoard } from "../slices/boardSlice";
import { deleteItem } from "../slices/boardItemSlice";

const deleteuserdata = createAsyncThunk<
  { boardId: number }, //함수가 반환하는 비동기생성자 함수 작업의 결과물의 타입을 지정
  { boardId: number } //인자로 받는 데이터의 타입을 지정
>("user/fetchUserDataDeletet", async ({ boardId }, thunkAPI) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  //파이어베이스 하위 컬렉션 경로

  const userCollection = collection(firestore, "users");
  const specificDoc = await getDocs(userCollection);

  specificDoc.docs.forEach(async (items) => {
    const list = items.data();
    const itemId = list.did;
    const itemIdIndex = list.index;

    if (boardId === itemId) {
      //삭제할 하위 문서 경로
      const strId = boardId.toString();
      const docRef = doc(userCollection, strId);

      await deleteDoc(docRef);
    }
  });

  //state 삭제
  thunkAPI.dispatch(deleteBoard({ boardId }));
  thunkAPI.dispatch(deleteItem({ boardId }));
  return { boardId };
});

export default deleteuserdata;
