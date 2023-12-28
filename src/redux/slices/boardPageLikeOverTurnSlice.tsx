import { createSlice } from "@reduxjs/toolkit";
import userPageLikeOverturn from "../thunks/boardPageLikeThunks";

interface LikeType {
  like: boolean;
  userUid: string;
}

interface MyStateLike {
  boardPage: Record<number, LikeType[]>;
}

const initialState: MyStateLike = {
  boardPage: {},
};

const boardPageLikedOverTurnSlice = createSlice({
  name: "pageLikes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userPageLikeOverturn.pending, (state, action) => {
        console.log(`비동기 좋아요 해제 요청 중`);
      })
      .addCase(userPageLikeOverturn.fulfilled, (state, action) => {
        console.log(`비동기 좋아요 해제 요청 성공`);
        const { boardId, boardPage: pageLike } = action.payload;

        // if (boardId && pageLike) {
        //   state.pageLike[boardId] = pageLike;
        // }
      })
      .addCase(userPageLikeOverturn.rejected, (state, action) => {
        console.log(`비동기 좋아요 해제 요청 실패`);
      });
  },
});

export default boardPageLikedOverTurnSlice.reducer;
