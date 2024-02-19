import { createSlice } from "@reduxjs/toolkit";

//비동기 연동
import deleteuserdata from "../thunks/boardDelteThunk";

//입력되는 데이터 타입
interface UserdataType {
  did: number;
  title: string;
  content: string;
  timedata: Date;
}

//타입을 초기 값에 연동 시키위해
//Record 사용 이유 id 값이 key UserdataType[]은 value
interface MyState {
  boarditem: Record<number, UserdataType[]>;
}

//초기 값 설정
const initialState: MyState = {
  boarditem: {}, //객체 형태
};

const boardItemDelelteSlice = createSlice({
  name: "boardItemDl", // 슬라이스 이름
  initialState, //초기 값
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteuserdata.pending, (state, action) => {
        console.log(` 삭제 비동기 요청 중`);
      })
      .addCase(deleteuserdata.fulfilled, (state, action) => {
        console.log(` 삭제 비동기 성공`);
      })
      .addCase(deleteuserdata.rejected, (state, action) => {
        console.log(`삭제 비동기 요청 실패`);
      });
  },
});

export default boardItemDelelteSlice.reducer;
