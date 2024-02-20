//스토어 만들기 위해
import { configureStore } from "@reduxjs/toolkit";

// 데이터를 저장할 리듀서를 가져옴
import rootReducer from "./reducer";

//스토어의 상태를 저장,복원하기 위한 라이브러리
import { persistStore, persistReducer } from "redux-persist";
//세션과 스토리지 둘중 스토리지 선택
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const persistConfig = {
  key: "root", //저장할 데이터 key
  storage, //사용할 엔진
};

//Redux Store와 redux-persist를 연동
// 1. persistConfig객체를 만든다
// 2.persistConfig와 rootReducer를 파라미터로 받는 persistedReducer 만든다
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux 스토어를 생성
// 리듀서는 원래의 루트 리듀서에 Redux Persist의 지속성 관련 로직을 추가
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return [...defaultMiddleware];
  },
});

//Redux Persist가 설정된 Redux 스토어를 초기화하고 Redux 상태의 지속성을 관리하는 데 사용
//다른 파일에서 가져와 사용할 수 있다
export const persistor = persistStore(store);
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
