import React, { useState } from "react";
//파베에서 제공 되는 로그인 함수
import { signInWithEmailAndPassword } from "firebase/auth";
import { firestore, appAuth } from "../../firebase";
//페이지 전환 위해 사용
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/loginSlice";
//

//로그인 할시 입력 되는 값 타입
interface LoginValue {
  email: string;
  password: string;
}
const Login = (props: LoginValue) => {
  const dispatch = useDispatch();

  //로그인 이메일
  const [email, setEamil] = useState("");
  //로그인 비밀번호
  const [password, setPassword] = useState("");
  //로그인 후 화면 이동
  const navigate = useNavigate();

  const auth = appAuth;
  //로그인
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //파베에서 사용 되는 함수
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        dispatch(setUser(user)); // Redux 상태 업데이트
        //로그인 후 이동 되는 화면
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };
  return (
    <div className="userBox">
      <h3>로그인</h3>
      <div className="userBox_content">
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              value={email}
              placeholder="이메일"
              required
              onChange={(e) => {
                setEamil(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div>
            <button type="submit">로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
