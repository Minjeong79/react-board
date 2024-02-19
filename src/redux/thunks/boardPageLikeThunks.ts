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
    const { boardId, boardPage } = data;
    const { like, userUid } = boardPage;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const strId = data.boardId.toString();

    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, strId);
    const userDoc = getDoc(userDocRef);
    const dataDoc = (await userDoc).data();
    console.log(dataDoc);
    const subCollectionRef = collection(userDocRef, "like");

    if (dataDoc) {
      if (userId !== dataDoc.userUid || userId) {
        const underSetDoc = doc(subCollectionRef, userId as string);

        await setDoc(underSetDoc, {
          like: true,
          userUid: userId,
          did: userUid,
        });
      } else {
        window.alert("좋아요 선택 할 수 없습니다.");
      }
    } else {
      console.log("달라요------------------");
    }

    const responseDataLike = {
      boardId: boardId,
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
