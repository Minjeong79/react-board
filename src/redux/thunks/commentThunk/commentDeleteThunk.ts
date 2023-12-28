import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { deleteCommentSlice } from "../../slices/commentSlice/commentSlice";

const deleteComment = createAsyncThunk<
  { boardId: number; dataCUid: string; numIndex: string },
  { boardId: number; dataCUid: string; numIndex: string }
>("user/commentDelete", async (data, thunkAPI) => {
  const { boardId, dataCUid, numIndex } = data;

  const state: any = thunkAPI.getState();

  const userCommentDocIndx = state.boardPageComment.boardComment;

  const strId = boardId.toString();

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

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
    const commentDoc = await getDocs(lastCallectionRef);

    let commentDeleted = false; // 선택한 댓글이 삭제되었는지 여부를 나타내는 플래그
    //댓글 데이터
    for (const [index, docC] of commentDoc.docs.entries()) {
      const dataC = docC.data();
      const dataCUid = dataC.dataCUid;
      const dataIndex = dataC.numIndex;
      const docId = docC.id;
      if (dataCUid === userId && dataIndex === numIndex) {
        console.log("--------------");
        const docRef = doc(lastCallectionRef, dataIndex);
        await deleteDoc(docRef);

        thunkAPI.dispatch(deleteCommentSlice({ boardId, dataCUid, numIndex }));
        commentDeleted = true; // 댓글이 삭제되었음을 표시
        break; // 루프를 중지
      }
    }
    if (commentDeleted) {
      break; // 댓글이 삭제되었을 경우 전체 반복문 중지
    }
  }

  const responseData = {
    boardId: boardId,
    dataCUid: userId || "",
    numIndex: numIndex,
  };
  return responseData;
});

export default deleteComment;
