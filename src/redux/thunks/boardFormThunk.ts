import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface UserData {
  did: number;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified: boolean;
  index: string;
  displayName: string;
}

//1 함수는 첫 번째 매개변수로 액션 이름 문자열
//2 매개변수를 받아서 비동기 작업을 수행하고 작업이 성공하면 결과 데이터를 반환
const addUserData = createAsyncThunk<
  { boardId: number; boarditem: UserData },
  { boardId: number; boarditem: UserData }
>("user/fetchUserData", async (data, thunkAPI) => {
  const { boardId, boarditem } = data;
  const DboardId = data.boardId;
  const strId = DboardId.toString();
  const { title, content, index, displayName } = boarditem;

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const userCollection = collection(firestore, "users");

  const dataIn = {
    did: boardId,
    title: title,
    content: content,
    timedata: new Date(),
    userUid: userId as string,
    isModified: false,
    displayName: displayName,
    index: index,
  };

  //이름 지어서 하위 문서 생성
  // await setDoc(doc(userDataCollrection, index), dataIn);
  await setDoc(doc(userCollection, strId), dataIn);

  //문서 이름 자동으로 생성
  // await addDoc(userDataCollrection, dataIn);

  // 반환할 데이터 형식
  const responseData = {
    boardId: boardId,
    boarditem: {
      did: boardId,
      title: title,
      content: content,
      timedata: new Date(),
      userUid: userId as string,
      isModified: false,
      displayName: displayName,
      index: index,
    },
  };

  return responseData;
});

export default addUserData;
