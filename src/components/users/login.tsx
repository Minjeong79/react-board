import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { appAuth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/loginSlice";

const Login = () => {
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

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ); 
      const user = userCredential.user;
      const uidMask = user.uid.slice(0,5);
      const maskedPart = '*'.repeat(user.uid.length - 5);;
      const uid = uidMask + maskedPart;

      console.log(uid);
      const userDb = {
        uid : uid,
        displayName:user.displayName,
        email:user.email,
      }
      if (user) {
        dispatch(setUser(userDb));
        navigate("/");
      } else {
        console.log("user 정보가 없습니다.");
      }
    
    } catch (error) {
      console.log(error);
    }
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
