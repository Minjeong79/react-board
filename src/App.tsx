import React, { useState, useEffect } from "react";

import Form from "./components/users/Form";
import Board from "./components/board/board";
import Page from "./components/board/page";
import Sign from "./components/users/sign";
import Login from "./components/users/login";
import Modify from "./components/board/modifyForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appAuth } from "./firebase";

import { useSelector, useDispatch } from "react-redux";
import CommentModifiy from "./components/comment/CommentModify";
import ReplyComment from "./components/comment/ReplyComment";
import Header from "./components/board/Header";
import "./scss/main.css";
import "./scss/style.css";

function App() {
  //로그인 상태 초기화 관리
  const [init, setInit] = useState(false);
  //사용자의 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 해당 경로로 이동될 컴포 넌트 작성 */}
        <Route path="/" element={<Board />}></Route>
        <Route path="/form" element={<Form />}></Route>
        {/* page는 보드의 id 별로 상세페이지의 경로를 지정 하기 위해서 :id를 추가 */}
        <Route path="/page/:id" element={<Page />}></Route>
        <Route path="/pagemodify/:id" element={<Modify />}></Route>
        <Route path="/commentModifiy/:id" element={<CommentModifiy />}></Route>
        <Route path="/replyComment/:id" element={<ReplyComment />}></Route>
        <Route path="/sign" element={<Sign />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
