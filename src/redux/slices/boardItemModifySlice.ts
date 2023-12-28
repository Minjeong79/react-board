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
        const { boardId, boarditem: bItem } = action.payload;

        const updatedBoardItem = {
          ...state.boarditem, // 기존 상태의 boarditem 객체를 복사
          [boardId]: [
            ...(state.boarditem[boardId] || []), //()먼저 확인 하고 값 있으면 복사 아니면 빈값
            {
              did: bItem.did,
              title: bItem.title,
              content: bItem.content,
              timedata: bItem.timedata,
              userUid: bItem.userUid,
              isModified: true,
              index: bItem.index,
            },
          ],
        };
        // updatedBoardItem[boardId] = updatedBoardItem[boardId] || [];
        // updatedBoardItem[boardId].push({
        //   did: bItem.did,
        //   title: bItem.title,
        //   content: bItem.content,
        //   timedata: bItem.timedata,
        //   userUid: bItem.userUid,
        //   isModified: true,
        // });
        return {
          ...state,
          boarditem: updatedBoardItem,
        };
      })
      .addCase(modifyUserData.rejected, (state, action) => {
        console.log(`비동기 수정 요청 실패`);
      });
  },
});

export default boardItemModify.reducer;
