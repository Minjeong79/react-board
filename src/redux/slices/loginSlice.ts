import { createSlice } from "@reduxjs/toolkit";

interface FirebaseUser {
  uid:string;
  email: string;
  displayName: string;
}
const userInfo: FirebaseUser = {
  uid:"",
  email: "",
  displayName: "",
};
const initialState = {
  user: userInfo,
};

const loginReducer = createSlice({
  name: "login", //슬라이스 이름
  initialState, //초기값
  reducers: {
    //state는 현재 상태의 state, action은 데이터
    setUser: (state, action) => {
      const userI = action.payload; // 로그인 후 사용자 정보 업데이트
      state.user = userI;
    },
    clearUser: (state, action) => {
      const userOut = action.payload;
      state.user = userOut; // 로그아웃 시 사용자 정보 초기화
      return state;
    },
    selectUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, clearUser, selectUser } = loginReducer.actions;

export default loginReducer.reducer;
