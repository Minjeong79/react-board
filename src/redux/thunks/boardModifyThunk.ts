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
  displayName: string;
}

const modifyUserData = createAsyncThunk<
  { boardId: number; boarditem: UserData },
  { boardId: number; boarditem: UserData }
>("user/fetchUserModifyDta", async (data, thunkAPI) => {
  const { boardId, boarditem } = data;
  const DboardId = data.boardId;
  const strId = DboardId.toString();
  const { title, content, index, displayName } = boarditem;

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const userCollection = collection(firestore, "users");

  const datas = await getDocs(userCollection);

  const dataI = datas.docs.map(async (item) => {
    const dt = item.data();
    const docIddt = item.id;

    if (dt.did === boardId) {
      const dataIn = {
        did: boardId,
        title: title,
        content: content,
        timedata: new Date(),
        userUid: userId as string,
        isModified: true,
        displayName: displayName,
        index: index,
      };

      const docRef = doc(userCollection, docIddt);
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
      displayName: displayName,
      index: index,
    },
  };
  return responseData;
});

export default modifyUserData;
