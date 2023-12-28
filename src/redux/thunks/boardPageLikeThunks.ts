import { createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../firebase";
import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface LikeType {
  like: boolean;
  userUid: string;
}
const userPageLike = createAsyncThunk<
  { boardId: number; boardPage: LikeType },
  { boardId: number; boardPage: LikeType }
>("userPage/likeClick", async (data, thunkAPI) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: any = thunkAPI.getState();
    const boardSelectedId = state.board.selectedBoardId;
    const strId = data.boardId.toString();

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
      const dataUserId = data.userUid;
      //하위 도큐멘트
      const docRef = doc(subCollectionRef, dataIndex);

      //하위 컬렉션
      const lastCallectionRef = collection(docRef, "like");

      if (boardSelectedId === dataId && userId !== dataUserId) {
        const underSetDoc = doc(lastCallectionRef, userId as string);

        await setDoc(underSetDoc, {
          like: true,
          userUid: userId,
          did: dataId,
        });
      } else {
        console.log("달라요------------------");
      }
    }

    const responseDataLike = {
      boardId: boardSelectedId,
      boardPage: {
        like: true,
        userUid: userId as string,
      },
    };

    return responseDataLike;
  } catch (error) {
    // 에러 처리
    console.error("Error in userPageLike thunk:", error);
    throw error;
  }
});

export default userPageLike;
