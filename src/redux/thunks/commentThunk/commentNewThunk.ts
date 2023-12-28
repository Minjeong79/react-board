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

const userComment = createAsyncThunk<
  { boardId: number; boardComment: CommentType },
  { boardId: number; boardComment: CommentType }
>("user/comment", async (data, thunkAPI) => {
  try {
    const { boardId, boardComment } = data;
    const { content, numIndex } = boardComment;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    const state: any = thunkAPI.getState();
    // const boardSelectedId = state.board.selectedBoardId;
    const strId = data.boardId.toString();
    const userNicNameList = state.login.userLists;
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
          isModified: false,
        };

        await setDoc(doc(lastCallectionRef, numIndex), dataComment);
      } else {
        console.log("댓글 오류------------------");
      }
    }
    const responseDataComment = {
      boardId: boardId,
      boardComment: {
        content: content,
        numIndex: numIndex,
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
