import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import deleteuserdata from "../../redux/thunks/boardDelteThunk";
import userPageLike from "../../redux/thunks/boardPageLikeThunks";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { firebaseApp, firestore, appAuth } from "../../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import userPageLikeOverturn from "../../redux/thunks/boardPageLikeOverturnThunk";
import Comment from "../comment/Comment";

interface Boardtype {
  did: number;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified: boolean;
  index: string;
  displayName: string;
}

const Page = () => {
  const userCollection = collection(firestore, "users");

  const auth = appAuth;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const userUidValue = useSelector((state: any) => state.login.user);
  // const uidVar = userUidValue?.uid;

  // console.log(uidVar);
  console.log(userId);

  const { id } = useParams();
  const boardId = Number(id);
  const strId = boardId.toString();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [boardDatat, setBoardData] = useState<Boardtype[]>([]);
  const [likeClick, setLikeClick] = useState(false);
  const [underDb, setUnderDb] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleDelete = async () => {
    try {
      window.confirm("삭제 하시 겠습니까?");
      dispatch(
        deleteuserdata({
          boardId: boardId,
        }) as any
      );
      //목록 페이지로 이동
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const userDocRef = doc(userCollection, strId);
  const handleBoardDataList = async () => {
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(userCollection);
    const newData = specificDoc.docs.map((item) => {
      const data = item.data();
      const date = data.timedata.toDate();
      const boardItem: Boardtype = {
        did: data.did,
        title: data.title,
        content: data.content,
        timedata: data.timedata.toDate(), // Firestore에서 날짜는 Timestamp로 반환되므로 Date로 변환
        userUid: data.userUid,
        isModified: data.isModified,
        index: data.index,
        displayName: data.displayName,
      };

      return boardItem;
    });
    setBoardData(newData);
  };

  //좋아요
  const handleLikeUpdate = async () => {
    try {
      const subCollectionRef = collection(userDocRef, "like");
      const sublikes = await getDocs(subCollectionRef);
      const length = sublikes.size;
      setUnderDb(length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoodClick = async () => {
    interface LikeType {
      like: boolean;
      userUid: string;
    }

    const subCollectionRef = collection(userDocRef, "like");
    const userDoc = doc(subCollectionRef, userId);
    const dataDoc = await getDoc(userDoc);
    const likedVar = (await dataDoc).data() as LikeType;

    const liked = {
      like: true,
      userUid: userId as string,
    };
    const likedF = {
      like: false,
      userUid: userId as string,
    };

    if (!likedVar || !likedVar.like) {
      // 좋아요를 누르지 않은 경우 또는 데이터가 없는 경우 좋아요 추가
      await dispatch(
        userPageLike({
          boardId: boardId,
          boardPage: liked,
        }) as any
      );
      setLikeClick(true);
      setUnderDb(underDb + 1); // 좋아요 수 증가
    } else {
      // 이미 좋아요를 누른 경우 좋아요 삭제
      await dispatch(
        userPageLikeOverturn({
          boardId: boardId,
          boardPage: likedF,
        }) as any
      );
      setLikeClick(false);
      setUnderDb(underDb - 1); // 좋아요 수 감소
    }
  };

  useEffect(() => {
    handleBoardDataList();

    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `images/${userId}/${boardId}/`);

    listAll(imageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrl(url);
        });
      });
    });
  }, [boardId, imageUrl]);

  useEffect(() => {
    handleLikeUpdate();
  }, [likeClick]);
  return (
    <section>
      <div className="container">
        <div className="page_box">
          {boardDatat.map((item, index) => (
            <div key={index}>
              {boardId === item.did ? (
                <section>
                  <p className="title">{item.title}</p>
                  <div className="userInfo">
                    <span>{item.displayName} </span>
                    <span>
                      {item.timedata.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="page_txt">
                    {item.content}
                    {imageUrl === null ? <></> : <img src={imageUrl} />}
                  </div>
                </section>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>

        <div className="likeBtnBox">
          <div className="likeBtnBox_list">
            <button className="likeBtn" onClick={handleGoodClick}>
              {!likeClick ? (
                <div className="unSelectLike">
                  <FavoriteBorderIcon></FavoriteBorderIcon>
                </div>
              ) : (
                <div className="selectLike">
                  <FavoriteIcon></FavoriteIcon>
                </div>
              )}
            </button>
            <span> {underDb}</span>
          </div>
          <div className="board_back_btn">
            <Link to="/">목록</Link>
          </div>
        </div>

        <div className="page_btn">
          {boardDatat.map((item) => {
            console.log(item);
            console.log("userId:", userId);
            console.log("item.userUid:", item.userUid);
            console.log("Match:", userId === item.userUid);

            return boardId === item.did && userId === item.userUid ? (
              <div key={item.did}>
                <div className="edit_btn">
                  <Link to={`/pagemodify/${boardId}`}>수정</Link>
                </div>
                <input type="button" onClick={handleDelete} value="삭제" />
              </div>
            ) : null;
          })}
        </div>
        <Comment boardId={boardId} />
      </div>
    </section>
  );
};

export default Page;
