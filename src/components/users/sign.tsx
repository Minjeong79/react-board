import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Sign = () => {
  //회원가입 이메일
  const [emailValue, setEamilValue] = useState("");
  //회원가입 비밀번호
  const [passwordValue, setPasswordValue] = useState("");
  //닉네임
  const [nickNameValue, setNickNameValue] = useState("");

  //회원가입 후 화면 이동
  const navigate = useNavigate();

  const auth = getAuth();
  //회원가입 내용
  const signupHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: nickNameValue,
        });
      } else {
        console.log("사용자 정보가 없습니다");
      }

      setEamilValue("");
      setPasswordValue("");
      setNickNameValue("");
      //   setIsSignupSuccess(true);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userBox">
      <h3>회원가입</h3>
      <div className="userBox_content">
        <form onSubmit={signupHandler}>
          <div>
            <input
              type="text"
              placeholder="닉네임"
              value={nickNameValue}
              required
              onChange={(e) => {
                setNickNameValue(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="이메일"
              value={emailValue}
              required
              onChange={(e) => {
                setEamilValue(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value);
              }}
            />
          </div>
          <div>
            <button type="submit">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sign;
