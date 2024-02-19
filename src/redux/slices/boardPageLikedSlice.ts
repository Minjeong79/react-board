import { createSlice } from "@reduxjs/toolkit";
import userPageLike from "../thunks/boardPageLikeThunks";

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

const boardPageLikedSlice = createSlice({
  name: "pageLikes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userPageLike.pending, (state, action) => {
        console.log(`비동기 좋아요 요청 중`);
      })
      .addCase(userPageLike.fulfilled, (state, action) => {
        console.log(`비동기 좋아요 요청 성공`);
      })
      .addCase(userPageLike.rejected, (state, action) => {
        console.log(`비동기 좋아요 요청 실패`);
      });
  },
});

export default boardPageLikedSlice.reducer;
