import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import modifyUserData from "../../redux/thunks/boardModifyThunk";
import { customAlphabet } from "nanoid";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "../../firebase";

const Modify = () => {
  const { id } = useParams();
  const boardId = Number(id);

  //기존 데이터
  const userData = useSelector((state: any) => state.boardItemMap.boarditem);

  //수정된 데이터
  const modifyBoarddata = useSelector(
    (state: any) => state.boardModify.boarditem
  );
  const selectedBoardId = useSelector(
    (state: any) => state.board.selectedBoardId
  );

  //입력한 데이터
  const inputData = userData[boardId];
  const inputDataIdx = inputData[0].index;

  //수정한 데이터
  const modifyUserDataListIdx = modifyBoarddata?.[boardId]?.length - 1;

  const modifyUserDataLast = modifyBoarddata[boardId]?.[modifyUserDataListIdx];

  //유저 정보
  const userUidValue = useSelector((state: any) => state.login.user);
  const userId = userUidValue?.uid;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //사용자가 입력 한 데이터
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
  });

  const handleWrite = async (e: any) => {
    e.preventDefault();

    const filedName = e.target.name;
    const fieldValue = e.target.value;

    if (!formValue) {
      window.confirm("제목과 내용을 입력 해주세요");
      return;
    }
    try {
      const userData = {
        did: boardId,
        title: formValue.title,
        content: formValue.content,
        timedata: new Date(),
        userUid: userId,
        isModified: true,
        index: inputDataIdx,
      };
      await dispatch(
        modifyUserData({
          boardId: boardId,
          boarditem: userData,
        }) as any
      );

      setFormValue({
        ...formValue,
        [filedName]: fieldValue,
      });

      navigate(`/page/${boardId}`);
    } catch (error) {
      console.log(error);
      console.log("입력 오류 입니다");
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소 하시겠습니까?")) {
      navigate(`/`);
    }
  };

  //이미지 등록
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(firebaseApp);

  const [oldimageNameUrl, setOldImageNameUrl] = useState("");

  const handleImageUpload = async (e: any) => {
    e.preventDefault();
    if (imageUpload === null) return;
    //경로
    const imageRef = ref(
      storage,
      `images/${userId}/${selectedBoardId}/${inputDataIdx}/${imageUpload.name}`
    );

    //업로드 하는 곳 경로,올라갈 파일
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };

  useEffect(() => {
    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `images/${userId}/${boardId}/`);

    listAll(imageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setOldImageNameUrl(url);
        });
      });
    });
  }, []);

  const handleImageDelete = (e: any) => {
    e.preventDefault();
    const desertRef = ref(storage, imageUrl);
    deleteObject(desertRef)
      .then(() => {
        setImageUrl("");
        console.log("삭제 완료");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };
  return (
    <div className="container">
      <header>
        <h1>글 수정 페이지 </h1>
      </header>
      <form onSubmit={handleWrite}>
        {modifyUserDataLast?.userUid === userId &&
        modifyUserDataLast.isModified === true ? (
          <div>
            <div className="input_box">
              <input
                type="text"
                maxLength={30}
                name="title"
                defaultValue={modifyUserDataLast.title} //등록된 데이터 출력
                placeholder="제목을 입력해주세요."
                onChange={(e) =>
                  setFormValue({ ...formValue, title: e.target.value })
                }
              />
            </div>
            <div className="textarea_box">
              <textarea
                defaultValue={modifyUserDataLast.content}
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
          <div>
            <div className="input_box">
              <input
                type="text"
                maxLength={30}
                name="title"
                defaultValue={inputData[0].title} //등록된 데이터 출력
                placeholder="제목을 입력해주세요."
                onChange={(e) =>
                  setFormValue({ ...formValue, title: e.target.value })
                }
              />
            </div>
            <div className="textarea_box">
              <textarea
                defaultValue={inputData[0].content}
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
        )}

        <div className="form_btn_box">
          <input type="submit" value="등록" />
          <input type="button" value="취소" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default Modify;
