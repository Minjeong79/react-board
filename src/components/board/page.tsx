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
import { firebaseApp, firestore } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import userPageLikeOverturn from "../../redux/thunks/boardPageLikeOverturnThunk";
import Comment from "../comment/Comment";
const Page = () => {
  const [likeClick, setLikeClick] = useState(false);

  // URL 파라미터에서 id 추출
  const { id } = useParams();
  const boardId = Number(id);

  const userData = useSelector((state: any) => state.boardItemMap.boarditem);
  //데이터를 각 key에 맞춰 넣기 위해 비구조화 할당 사용
  const userDataVar: any = userData[boardId];
  const { did, title, content, timedata, userUid } = userDataVar;

  console.log();
  const boardSelectedId = useSelector(
    (state: any) => state.board.selectedBoardId
  );

  //수정된 데이터
  const modifyBoarddata = useSelector(
    (state: any) => state.boardModify.boarditem
  );
  const modifyBoardId = modifyBoarddata[boardId]?.length - 1;
  const modifyBoardDataOne = modifyBoarddata?.[boardId]?.[modifyBoardId];

  const userUidValue = useSelector((state: any) => state.login.user);
  const userUidList = useSelector((state: any) => state.login.userLists);
  const uidVar = userUidValue?.uid;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  //날짜
  function formatDate(dateSt: string) {
    const userDates = new Date(dateSt);
    return userDates.toLocaleDateString("ko-KR");
  }

  const matchingUser = userUidList.find(
    (user: any) => user.uid === userDataVar[0].userUid
  );

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `images/${uidVar}/${boardSelectedId}/`);

    listAll(imageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrl(url);
        });
      });
    });
  }, [id]);

  const strId = boardId.toString();

  //파이어베이스에서 데이터를 가져와서 값을 비교
  const handleGoodClick = async () => {
    //컬렉션
    const userCollection = collection(firestore, "users");
    //도큐멘트
    const userDocRef = doc(userCollection, "userData");
    //컬렉션>도큐멘트>userId이름을 가진 하위 컬렉션
    const subCollectionRef = collection(userDocRef, strId);
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
    const subCollectionRef = collection(userDocRef, strId);
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

  const userPageComment = userComments?.[boardId];

  return (
    <>
      {/* Page 컴포넌트의 내용을 id에 따라 동적으로 표시 */}
      <div className="container">
        <div className="page_box">
          {modifyBoardDataOne?.isModified === true ? (
            <section>
              <p className="title">{modifyBoardDataOne.title}</p>
              <div className="userInfo">
                {userUidList.map((name: any, index: number) => {
                  if (name.uid === matchingUser.uid) {
                    return <span key={index}>{name.displayName}</span>;
                  } else {
                  }
                })}
                <span>{formatDate(modifyBoardDataOne.timedata)}</span>
              </div>
              <div className="page_txt">
                {modifyBoardDataOne.content}
                <img src={imageUrl} />
              </div>
            </section>
          ) : (
            <section>
              <p className="title">{userDataVar[0].title}</p>
              <div className="userInfo">
                {userUidList.map((name: any, index: number) => {
                  if (name.uid === matchingUser.uid) {
                    return <span key={index}>{name.displayName}</span>;
                  } else {
                  }
                })}
                <span>{formatDate(userDataVar[0].timedata)}</span>
              </div>
              <div className="page_txt">
                {userDataVar[0].content}
                <img src={imageUrl} />
              </div>
            </section>
          )}
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
          {userDataVar[0].userUid === uidVar && (
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

        <Comment userPageComment={userPageComment} boardId={boardId} />
      </div>
    </>
  );
};

export default Page;
