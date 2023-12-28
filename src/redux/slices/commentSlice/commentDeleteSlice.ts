import { createSlice } from "@reduxjs/toolkit";
import deleteComment from "../../thunks/commentThunk/commentDeleteThunk";

interface CommentType {
  content: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
}

interface MyComment {
  boardComment: Record<number, CommentType[]>;
}

const initialState: MyComment = {
  boardComment: {},
};

const boardPageCommentDl = createSlice({
  name: "pageCommentDl",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteComment.pending, (state, action) => {
        console.log(`댓글 삭제 비동기 요청 중`);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        console.log(`댓글 삭제 비동기 성공`);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        console.log(`댓글 삭제 비동기 요청 실패`);
      });
  },
});

export default boardPageCommentDl.reducer;
