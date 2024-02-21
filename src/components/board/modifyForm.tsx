import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useParams } from "react-router-dom";
import modifyUserData from "../../redux/thunks/boardModifyThunk";
import { firebaseApp, firestore, appAuth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { RootLoginState } from "../../redux/reducer";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
const Modify = () => {
  const userCollection = collection(firestore, "users");
  //유저 정보
  const userUidValue = useAppSelector((state: RootLoginState) => state.login.user);
  const displayName = userUidValue.displayName;

  const auth = appAuth;
  const currentUser = auth.currentUser;
  const userId = currentUser!.uid;

  const { id } = useParams();
  const boardId = Number(id);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [importId, setImPortId] = useState(0);
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
  });
  const [oldStrId, setOldStrId] = useState("");

  //이미지 등록
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [oldimageNameUrl, setOldImageNameUrl] = useState("");
  const storage = getStorage(firebaseApp);

  const [boardDatat, setBoardData] = useState<Boardtype[]>([]);

  const handleId = () => {
    setImPortId(boardId);
  };

  const handleBoardDataList = async () => {
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(userCollection);
    const newData = specificDoc.docs.map((item) => {
      const data = item.data();
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

  const handleWrite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filedName = e.currentTarget.name;
    const fieldValue = e.currentTarget.value;

    if (!formValue.title || !formValue.content) {
      window.alert("제목과 내용을 입력해주세요.");
      return;
    }
    //하위 컬렌션이 가진 모든 하위 도큐멘트 출력 getDocs사용
    const specificDoc = await getDocs(userCollection);
    const newData = specificDoc.docs.map((item) => {
      const data = item.data();
      // const date = data.timedata.toDate();
      const boardItem: Boardtype = {
        did: data.did,
        title: data.title,
        content: data.content,
        timedata: data.timedata.toDate(), // Firestore에서 날짜는 Timestamp로 반환되므로 Date로 변환
        userUid: data.userUid,
        isModified: data.isModified,
        index: data.index,
        displayName: displayName,
      };
      setOldStrId(boardItem.index);
      return boardItem;
    });

    try {
      const userData: Boardtype = {
        did: boardId,
        title: formValue.title,
        content: formValue.content,
        timedata: new Date(),
        userUid: userId,
        isModified: true,
        index: oldStrId,
        displayName: displayName,
      };
      await dispatch(
        modifyUserData({
          boardId: boardId,
          boarditem: userData,
        })
      );

      setFormValue({
        ...formValue,
        [filedName]: fieldValue,
      });

      navigate(`/page/${boardId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소 하시겠습니까?")) {
      navigate(`/`);
    }
  };

  const handleImageDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const desertRef = ref(storage, imageUrl);
    deleteObject(desertRef)
      .then(() => {
        setImageUrl("");
        console.log("삭제 완료");
      })
      .catch((error) => {});
  };

  const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageUpload === null) return;
    //경로
    const imageRef = ref(storage, `images/${importId}/${imageUpload.name}`);

    //업로드 하는 곳 경로,올라갈 파일
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        setImageUrl(url);
      });
    });
  };

  useEffect(() => {
    handleId();
    handleBoardDataList();

    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `images/${userId}/${importId}/`);

    listAll(imageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setOldImageNameUrl(url);
        });
      });
    });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>글 수정 페이지 </h1>
      </header>
      <form onSubmit={handleWrite}>
        {boardDatat.map((item, index) => (
          <div>
            {boardId === item.did ? (
              <div key={index}>
                <div className="input_box">
                  <input
                    type="text"
                    maxLength={30}
                    name="title"
                    defaultValue={item.title} //등록된 데이터 출력
                    placeholder="제목을 입력해주세요."
                    onChange={(e) =>
                      setFormValue({ ...formValue, title: e.target.value })
                    }
                  />
                </div>
                <div className="textarea_box">
                  <textarea
                    defaultValue={item.content}
                    name="content"
                    placeholder="내용을 입력 해주세요"
                    onChange={(e) =>
                      setFormValue({ ...formValue, content: e.target.value })
                    }
                  />
                  <img src={oldimageNameUrl} />
                </div>
                <div className="file_box">
                  <input
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setImageUpload(file);
                      }
                    }}
                  />

                  <button onClick={handleImageUpload}>업로드</button>
                  <button onClick={handleImageDelete}>삭제</button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}

        <div className="form_btn_box">
          <input type="submit" value="등록" />
          <input type="button" value="취소" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default Modify;
