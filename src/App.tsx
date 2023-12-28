import React, { useState, useEffect } from "react";
import "./scss/main.css";
import "./scss/style.css";
import Form from "./components/users/Form";
import Board from "./components/board/board";
import Page from "./components/board/page";
import Sign from "./components/users/sign";
import Login from "./components/users/login";
import Modify from "./components/board/modifyForm";
import ModifyPage from "./components/board/modifyPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { firestore, appAuth } from "./firebase";
import { getAuth, signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { creatBoard } from "../src/redux/slices/boardSlice";
import { clearUser } from "./redux/slices/loginSlice";
import CommentModifiy from "./components/comment/CommentModify";
import ReplyComment from "./components/comment/ReplyComment";
// import { useNavigate } from "react-router-dom";

function App() {
  //Redux 스토어에서 특정 액션을 디스패치
  const dispatch = useDispatch();

  //로그인 상태 초기화 관리
  const [init, setInit] = useState(false);
  //사용자의 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userUidValue = useSelector((state: any) => state.login.user);
  const uidVar = userUidValue?.uid;
  const auth = getAuth();

  useEffect(() => {
    //onAuthStateChanged 사용자의 로그인 상태가 변경될 때마다 호출
    appAuth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        //로그아웃한 상태를 새롭게 설정
        setIsLoggedIn(false);
      }
      //초기화 상태 새롭게 변경
      setInit(true);
    });
  }, []);

  //로그아웃
  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser(uidVar));
        console.log("로그아웃");
      })
      .catch((error) => {
        console.log("로그아웃 실패");
      });
  };
  // const navigate = useNavigate();

  //글쓰기 버튼의 함수
  const handleLinkClick = (event: any) => {
    if (uidVar === null) {
      dispatch(creatBoard(1));
    } else {
      window.confirm("로그인 해주세요");
      event.preventDefault();
      window.location.href = "/login";
    }
  };

  const loginpop = () => {
    window.confirm("로그인 해주세요");
    // navigate(`/login`);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="board_map">
              {!isLoggedIn ? (
                <div className="userText">
                  <Link to="/sign">회원가입</Link>
                  <Link to="/login">로그인</Link>
                </div>
              ) : (
                <>
                  <button onClick={logout}>로그아웃</button>
                </>
              )}
              <Board />
              <div className="write_btn">
                <Link to="/form" onClick={handleLinkClick}>
                  글쓰기
                </Link>
              </div>
            </div>
          }
        />
        {/* 해당 경로로 이동될 컴포 넌트 작성 */}
        <Route path="/form" element={<Form />}></Route>
        {/* page는 보드의 id 별로 상세페이지의 경로를 지정 하기 위해서 :id를 추가 */}
        <Route path="/page/:id" element={<Page />}></Route>
        <Route path="/pagemo/:id" element={<ModifyPage />}></Route>
        <Route path="/pagemodify/:id" element={<Modify />}></Route>
        <Route path="/commentModifiy/:id" element={<CommentModifiy />}></Route>
        <Route path="/replyComment/:id" element={<ReplyComment />}></Route>
        <Route path="/sign" element={<Sign email={""} password={""} />}></Route>
        <Route
          path="/login"
          element={<Login email={""} password={""} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
