import { createSlice } from "@reduxjs/toolkit";
import userReplyComment from "../../thunks/ReplyCommentThunk/commentReplyThunk";

interface ReplyType {
  content: string;
  numIndex: string;
  dataCUid: string;
  timedata: Date;
  displayName: string;
  isModified: boolean;
  commentId: string;
}

interface MyComment {
  boardReplyComment: Record<number, ReplyType[]>;
}

const initialState: MyComment = {
  boardReplyComment: {},
};

const boardPageRepplyComment = createSlice({
  name: "pageReplyComment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userReplyComment.pending, (state, action) => {
        console.log(`비동기 reply댓글 요청 중`);
      })
      .addCase(userReplyComment.fulfilled, (state, action) => {
        console.log(`비동기 reply댓글 요청 성공`);
        const { boardId, boardReplyComment: pageComment } = action.payload;

        const comment = state.boardReplyComment[boardId] || [];

        const newComment = [...comment, pageComment];

        state.boardReplyComment[boardId] = newComment;
      })
      .addCase(userReplyComment.rejected, (state, action) => {
        console.log(`비동기 reply댓글 실패`);
      });
  },
});
export default boardPageRepplyComment.reducer;
