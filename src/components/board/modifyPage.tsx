import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
//Link path에서 보내는 값을 받기 위해
import { useParams } from "react-router-dom";
//페이지 전환 위해
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import deleteuserdata from "../../redux/thunks/boardDelteThunk";
import userPageLike from "../../redux/thunks/boardPageLikeThunks";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { firebaseApp, firestore } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import userPageLikeOverturn from "../../redux/thunks/boardPageLikeOverturnThunk";
import Comment from "../comment/Comment";

const ModifyPage = () => {
  const [likeClick, setLikeClick] = useState(false);

  const { id } = useParams();
  const boardId = Number(id);
  //boardItemMap 상태 선택
  const userData = useSelector((state: any) => state.boardItemMap.boarditem);
  const boardSelectedId = useSelector(
    (state: any) => state.board.selectedBoardId
  );
  const modifiedData = useSelector((state: any) => state.boardModify.boarditem);
  const userUidValue = useSelector((state: any) => state.login.user);
  const uidVar = userUidValue?.uid;

  const navigate = useNavigate();

  //데이터를 각 key에 맞춰 넣기 위해 비구조화 할당 사용
  const moDataVar: any = modifiedData[Number(id)];
  const { did, title, content, timedata, userUid } = moDataVar;
  const dispatch = useDispatch();

  //id의 타입이 string이어서 number로 타입 변경
  const userUidList = useSelector((state: any) => state.login.userLists);
  const matchingUser = userUidList.find(
    (user: any) => user.uid === moDataVar[0].userUid
  );
  const handleDelete = async () => {
    try {
      window.confirm("삭제 하시 겠습니까?");
      dispatch(
        deleteuserdata({
          boardId: boardSelectedId,
        }) as any
      );
      //목록 페이지로 이동
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log("삭제가 안됩니다");
    }
  };

  const userDates = new Date(moDataVar[0].timedata);

  const yesr = userDates.getFullYear();
  //Date 객체에서 월(Month)은 0부터 시작하기 때문에
  //제로 표시된 월을 구하려면 1을 더해주어야 합니다.
  const month = userDates.getMonth() + 1;
  const date = userDates.getDate();

  const userDate = `${yesr}.${month}.${date}`;

  const handleDebtn = () => {
    if (moDataVar[0].userUid === uidVar) {
    } else {
      console.log("다릅니다");
    }
  };
  const modifiLsit = moDataVar.slice(-1);

  useEffect(() => {
    handleDebtn();
  }, []);

  const [imageNameList, setImageNameList] = useState("");

  useEffect(() => {
    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `images/${uidVar}/${boardSelectedId}/`);

    listAll(imageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageNameList(url);
        });
      });
    });
  }, [id]);

  const handleGoodClick = async () => {
    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, "userData");
    //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
    const subCollectionRef = collection(userDocRef, boardSelectedId.toString());
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(subCollectionRef);

    let userUids: string[] = [];
    specificDoc.docs.map(async (iData) => {
      const data = iData.data();
      const dataUserId = data.index;
      const docRef = doc(subCollectionRef, dataUserId);

      const lastCallectionRef = collection(docRef, "like");

      const underSpecificDoc = await getDocs(lastCallectionRef);
      console.log(uidVar);
      if (!userUids.includes(uidVar)) {
        userUids.push(uidVar);

        const liked = {
          like: true,
          userUid: uidVar as string,
        };

        await dispatch(
          userPageLike({
            boardId: boardSelectedId,
            boardPage: liked,
          }) as any
        );
        setLikeClick(true);

        underSpecificDoc.docs.map(async (und) => {
          const underd = und.data();
          if (underd.userUid === uidVar) {
            underd.like = false;

            const liked = {
              like: underd.like,
              userUid: uidVar as string,
            };

            await dispatch(
              userPageLikeOverturn({
                boardId: boardSelectedId,
                boardPage: liked,
              }) as any
            );
            setLikeClick(false);
            console.log(likeClick);
          }
        });
      }
    });
  };

  const [underDb, setUnderDb] = useState(0);

  const dataListPage = async () => {
    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, "userData");
    //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
    const subCollectionRef = collection(userDocRef, boardSelectedId.toString());
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(subCollectionRef);

    specificDoc.docs.map(async (iData) => {
      const data = iData.data();
      const dataUserId = data.index;
      const docRef = doc(subCollectionRef, dataUserId);

      const lastCallectionRef = collection(docRef, "like");
      const underSpecificDoc = await getDocs(lastCallectionRef);

      onSnapshot(lastCallectionRef, (snapshot) => {
        const underDbLength = snapshot.size;
        setUnderDb(underDbLength);
      });
    });
  };

  useEffect(() => {
    dataListPage();
  }, [boardSelectedId]);

  const userComments = useSelector(
    (state: any) => state.boardPageComment.boardComment
  );
  const userPageComment = userComments[boardId];
  return (
    <>
      {/* Page 컴포넌트의 내용을 id에 따라 동적으로 표시 */}
      <div className="container">
        <div className="page_box">
          {/* {moDataVar[0].userUid === uidVar && moDataVar[0].did === boardId && ( */}
          <section>
            <p className="title">{modifiLsit[0].title}</p>
            <div className="userInfo">
              {matchingUser && <span>{matchingUser.displayName}</span>}
            </div>
            <div className="page_txt">
              {modifiLsit[0].content}

              <img src={imageNameList} />
            </div>
          </section>
        </div>
        <div className="likeBtnBox">
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
          <span>좋아요 수 {underDb}</span>
        </div>
        <div className="board_back_btn">
          <Link to="/">목록</Link>
        </div>

        <div className="page_btn">
          {moDataVar[0].userUid === uidVar && (
            <div>
              <div className="edit_btn">
                <Link to={`/pagemodify/${id}`}>수정</Link>
              </div>
              <input
                type="button"
                onClick={() => handleDelete()}
                value="삭제"
              />
            </div>
          )}
        </div>
        <Comment userPageComment={userPageComment} />
      </div>
    </>
  );
};

export default ModifyPage;
