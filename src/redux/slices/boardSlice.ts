import { createSlice } from "@reduxjs/toolkit";

// 타입이 아닌 초깃값이 들어가야 함
const initialState = {
  boards: [],
  selectedBoardId: null,
};

const boardSlice = createSlice({
  name: "board", //슬라이스 이름
  initialState, //초기값
  reducers: {
    //reducer 함수
    creatBoard: (state: any, action) => {
      // 새로운 게시판을 추가하고 boardId 자동 생성하고 i
      //ndex 번호를 id값으로 추가
      const newBoard = { id: state.boards.length };
      //상태의 boards에 값 추가
      state.boards.push(newBoard);

      // 선택된 boardId 설정
      state.selectedBoardId = newBoard.id;
    },
    //보드 선택 하기
    selectBoard: (state: any, action) => {
      state.selectedBoardId = action.payload;
    },
    //보드 삭제
    deleteBoard: (state, action) => {
      //선택한 값 전달 받음
      const { boardId } = action.payload;
      // 전달 받은 id값 삭제
      delete state.boards[boardId];
      //초기화
      state.selectedBoardId = null;
    },
  },
});

export const { creatBoard, selectBoard, deleteBoard } = boardSlice.actions;

export default boardSlice.reducer;
