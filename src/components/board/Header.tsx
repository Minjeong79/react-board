import logo from "../../logo.png";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { appAuth } from "../../firebase";
import { clearUser } from "../../redux/slices/loginSlice";
import "../../scss/main.css";
import "../../scss/style.css";
import { RootLoginState } from "../../redux/reducer";
const Header = () => {
  

  const userUidValue = useSelector((state:RootLoginState) => state.login.user);
  const userNicName = userUidValue?.displayName;

  const auth = appAuth;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const dispatch = useDispatch();

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser(''));
        console.log("로그아웃");
      })
      .catch((error) => {
        console.log("로그아웃 실패");
      });
  };
  return (
    <header className="container">
      <ul className="">
        <li className="">
          <Link to={"/"}>
            <img src={logo} alt="로고 이미지" />
          </Link>
        </li>

        {userId ? (
          <li className=" ">
            <span>{userNicName} 님 </span>
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
