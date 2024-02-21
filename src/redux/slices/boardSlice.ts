import { createSlice } from "@reduxjs/toolkit";


interface BoardType {
  boards:number[];
  selectedBoardId:number;
}
// 타입이 아닌 초깃값이 들어가야 함
const initialState:BoardType = {
  boards: [],
  selectedBoardId: 0,
};

const boardSlice = createSlice({
  name: "board", //슬라이스 이름
  initialState, //초기값
  reducers: {
    //reducer 함수
    creatBoard: (state, action) => {
      const newBoardId = state.boards.length;
      const newBoard = [...state.boards]  
      state.boards = newBoard;
      state.selectedBoardId = newBoardId
    },
    //보드 선택 하기
    selectBoard: (state, action) => {
      state.selectedBoardId = action.payload;
    },
    //보드 삭제
    deleteBoard: (state, action) => {
      //선택한 값 전달 받음
      const { boardId } = action.payload;
      // 전달 받은 id값 삭제
      delete state.boards[boardId];
      //초기화
      state.selectedBoardId = 0;
    },
  },
});

export const { creatBoard, selectBoard, deleteBoard } = boardSlice.actions;

export default boardSlice.reducer;
