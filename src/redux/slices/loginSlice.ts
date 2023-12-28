import { createSlice } from "@reduxjs/toolkit";

// 초기 상태는 로그인되지 않은 상태로 가정
const initialState = {
  userLists: [],
  user: null,
};

const loginReducer = createSlice({
  name: "login", //슬라이스 이름
  initialState, //초기값
  reducers: {
    //state는 현재 상태의 state, action은 데이터
    setUser: (state: any, action) => {
      const userI = (state.user = action.payload); // 로그인 후 사용자 정보 업데이트
      const isUserExist = state.userLists.some(
        (user: any) => user.uid === userI.uid
      );

      if (!isUserExist) {
        state.userLists.push(userI);
      }
      return state;
    },
    clearUser: (state: any, action) => {
      state.user = null; // 로그아웃 시 사용자 정보 초기화
      return state;
    },
    selectUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, clearUser, selectUser } = loginReducer.actions;

export default loginReducer.reducer;
