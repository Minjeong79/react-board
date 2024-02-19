import { createSlice } from "@reduxjs/toolkit";
import boardCommentModify from "../../thunks/commentThunk/commentModifiyThunk";
interface CommentType {
  content: string;
  numIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
}
 
interface MyComment {
  boardCommentModify: Record<number, CommentType[][]>;
}

const initialState: MyComment = {
  boardCommentModify: {},
};

const boardPageCommentModifiy = createSlice({
  name: "pageCommentModifiy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(boardCommentModify.pending, (state, action) => {
        console.log(`비동기 댓글수정 요청 중`);
      })
      .addCase(boardCommentModify.fulfilled, (state, action) => {
        console.log(`비동기 댓글수정 요청 성공`);
      })
      .addCase(boardCommentModify.rejected, (state, action) => {
        console.log(`비동기 댓글수정 실패`);
      });
  },
});

export default boardPageCommentModifiy.reducer;
