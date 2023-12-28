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
  reducers: {
    // deleteCommentSlice: (state, action) => {
    //   const { boardId, dataCUid, numIndex } = action.payload;
    //   const comments = state.boardCommentModify[boardId] || [];
    //   const filteredComments = comments.filter(
    //     (comm) => !(comm.dataCUid === dataCUid && comm.numIndex === numIndex)
    //   );
    //   state.boardCommentModify[boardId] = filteredComments;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(boardCommentModify.pending, (state, action) => {
        console.log(`비동기 댓글수정 요청 중`);
      })
      .addCase(boardCommentModify.fulfilled, (state, action) => {
        console.log(`비동기 댓글수정 요청 성공`);
        const {
          boardId,
          boardCommentModify: pageComment,
          stateInd,
        } = action.payload;

        const currentComments = state.boardCommentModify[boardId] || [];
        const nestedComment = [...currentComments];

        // Convert WritableDraft<CommentType> to CommentType
        const unwrappedPageComment = pageComment as CommentType;
        nestedComment[stateInd] = [unwrappedPageComment];

        state.boardCommentModify[boardId] = nestedComment;
      })
      .addCase(boardCommentModify.rejected, (state, action) => {
        console.log(`비동기 댓글수정 실패`);
      });
  },
});
// export const { deleteCommentSlice } = boardPageCommentModifiy.actions;
export default boardPageCommentModifiy.reducer;
