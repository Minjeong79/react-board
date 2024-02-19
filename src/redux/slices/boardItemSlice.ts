import { createSlice } from "@reduxjs/toolkit";

//비동기 연동
import addUserData from "../thunks/boardFormThunk";

//입력되는 데이터 타입
interface UserdataType {
  did: number;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified?: boolean;
  index: string;
}

//타입을 초기 값에 연동 시키위해
//Record 사용 이유 id(key) 값이 number UserdataType[]은 value로 강제 하기 위해
interface MyState {
  boarditem: Record<number, UserdataType[]>;
}

//초기 값 설정
const initialState: MyState = {
  boarditem: {}, //객체 형태
};

const boardItemSlice = createSlice({
  name: "boardItemMap", // 슬라이스 이름
  initialState, //초기 값
  reducers: {
    //해당 id 값의 state는 삭제
    deleteItem: (state, action) => {
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserData.pending, (state, action) => {
        console.log(`비동기 요청 중`);
      })
      .addCase(addUserData.fulfilled, (state, action) => {
        // 비동기 작업 완료 후 상태를 업데이트
        console.log(`비동기 요청 성공`);
      })
      .addCase(addUserData.rejected, (state, action) => {
        console.log(`비동기 요청 실패`);
      });
  },
});
export const { deleteItem } = boardItemSlice.actions;
export default boardItemSlice.reducer;
