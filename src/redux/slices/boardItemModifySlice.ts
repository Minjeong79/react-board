import { createSlice } from "@reduxjs/toolkit";

import modifyUserData from "../thunks/boardModifyThunk";

interface UserdataType {
  did: number;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified: boolean;
  index: string;
}

interface MyState {
  boarditem: Record<number, UserdataType[]>;
}

//초기 값 설정
const initialState: MyState = {
  boarditem: {}, //객체 형태
};

const boardItemModify = createSlice({
  name: "boardModify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(modifyUserData.pending, (state, action) => {
        console.log(`비동기 수정 요청 중`);
      })
      .addCase(modifyUserData.fulfilled, (state, action) => {
        console.log(`비동기 수정 성공`);
      })
      .addCase(modifyUserData.rejected, (state, action) => {
        console.log(`비동기 수정 요청 실패`);
      });
  },
});

export default boardItemModify.reducer;
