import logo from "../../logo.png";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { appAuth } from "../../firebase";
import { clearUser } from "../../redux/slices/loginSlice";
import "../../scss/main.css";
import "../../scss/style.css";
import { RootLoginState } from "../../redux/reducer";
import { useEffect, useState } from "react";
const Header = () => {
  const userUidValue = useAppSelector(
    (state: RootLoginState) => state.login.user
  );
  const userNicName = userUidValue?.displayName;

  const auth = appAuth;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const [user, setUser] = useState("");
  const dispatch = useAppDispatch();

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser(""));
        console.log("로그아웃");
      })
      .catch((error) => {
        console.log("로그아웃 실패");
      });
  };

  useEffect(() => {
    setUser(userNicName);
  }, [userNicName]);
  return (
    <header className="container">
      <ul className="">
        <li className="">
          <Link to={"/"}>
            <img src={logo} alt="로고 이미지" />
          </Link>
        </li>

        {user ? (
          <li className=" ">
            <span>{user} 님 </span>
            <button className="logout_btn" onClick={logout}>
              <span>로그아웃</span>
            </button>
          </li>
        ) : (
          <li className="">
            <div>
              <Link to={"/sign"}>회원가입</Link>

              <Link to={"/login"}>로그인</Link>
            </div>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
