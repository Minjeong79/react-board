import { createAsyncThunk } from "@reduxjs/toolkit";

import { firestore } from "../../firebase";
import { collection, doc, updateDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface UserData {
  did: number;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified: boolean;
  index: string;
}

const modifyUserData = createAsyncThunk<
  { boardId: number; boarditem: UserData },
  { boardId: number; boarditem: UserData }
>("user/fetchUserModifyDta", async (data, thunkAPI) => {
  const { boardId, boarditem } = data;
  const DboardId = data.boardId;
  const strId = DboardId.toString();
  const { title, content, index } = boarditem;

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const userCollection = collection(firestore, "users");

  const userDataCollrection = collection(userCollection, "userData", strId);

  const datas = await getDocs(userDataCollrection);

  const dataI = datas.docs.map(async (item) => {
    const dt = item.data();
    console.log(dt);
    if (dt.did === boardId) {
      const dataIn = {
        did: boardId,
        title: title,
        content: content,
        timedata: new Date(),
        userUid: userId as string,
        isModified: true,
        index: index,
      };
      console.log(`${dataIn.index} 여기는 비동기`);
      // console.log("dt.did:", dt.did, "boardId:", boardId);

      const docRef = doc(userDataCollrection, index);
      await updateDoc(docRef, dataIn);
    }
  });

  const responseData = {
    boardId: boardId,
    boarditem: {
      did: boardId,
      title: title,
      content: content,
      timedata: new Date(),
      userUid: userId as string,
      isModified: true,
      index: index,
    },
  };
  return responseData;
});

export default modifyUserData;
