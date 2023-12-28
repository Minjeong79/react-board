import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import addUserData from "../../redux/thunks/boardFormThunk";
import deleteuserdata from "../../redux/thunks/boardDelteThunk";
import { customAlphabet } from "nanoid";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { firebaseApp } from "../../firebase";

const Form = () => {
  //사용자가 입력 한 데이터
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
  });

  //board 상태
  const selectedBoardId = useSelector(
    (state: any) => state.board.selectedBoardId
  );

  // 로그인한 사용자 상태
  const userUidValue = useSelector((state: any) => state.login.user);
  const userId = userUidValue?.uid;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nanoid = customAlphabet("123456789", 6);
  const strId = nanoid();

  const handleWrite = async (e: any) => {
    e.preventDefault();

    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    if (!formValue) {
      window.confirm("제목과 내용을 입력 해주세요");
      return;
    }

    try {
      //userData는 이 액션에 전달할 데이터
      //액션의 목적에 따라 어떤 데이터를 전달할지 정의
      const userData = {
        did: selectedBoardId, //board에서 불러 온 값
        title: formValue.title,
        content: formValue.content,
        timedata: new Date(),
        userUid: userId as string,
        isModified: false,
        index: strId,
      };

      /*
      일반적으로 Redux Toolkit에서 createAsyncThunk를 사용하면서, 
      해당 액션의 반환 타입을 명시적으로 지정하는 것은 까다로운 부분이 될 수 있습니다.
      보통 Redux Toolkit은 내부에서 액션 타입을 처리하고, 
      이에 따라 상태 업데이트를 자동으로 처리합니다.*/
      await dispatch(
        addUserData({
          boardId: selectedBoardId,
          boarditem: userData,
        }) as any
      );
      setFormValue({
        ...formValue,
        [fieldName]: fieldValue,
      });

      navigate(`/page/${selectedBoardId}`);
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

  //이미지 등록 관련
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(firebaseApp);

  const handleImageUpload = async (e: any) => {
    e.preventDefault();
    if (imageUpload === null) return;
    //경로
    const imageRef = ref(
      storage,
      `images/${userId}/${selectedBoardId}/${strId}/${imageUpload.name}`
    );

    //업로드 하는 곳 경로,올라갈 파일
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };

  //업로드 할 이미지 삭제
  const handleImageDelete = (e: any) => {
    e.preventDefault();
    const desertRef = ref(storage, imageUrl);
    deleteObject(desertRef)
      .then(() => {
        setImageUrl("");
        console.log("삭제 완료");
      })
      .catch((error) => {});
  };
  return (
    <>
      <div className="container">
        <header>
          <h1>글작성 </h1>
        </header>
        <form onSubmit={handleWrite} name="form">
          <div className="input_box">
            <input
              type="text"
              maxLength={30}
              name="title"
              value={formValue.title}
              placeholder="제목을 입력해주세요."
              onChange={(e) =>
                setFormValue({ ...formValue, title: e.target.value })
              }
            />
          </div>
          <div className="textarea_box">
            <textarea
              value={formValue.content}
              name="content"
              placeholder="내용을 입력 해주세요"
              onChange={(e) =>
                setFormValue({ ...formValue, content: e.target.value })
              }
            />
            <div className="img_box">
              <img src={imageUrl} />
            </div>
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
          <div className="form_btn_box">
            <input type="submit" value="등록" />
            <input type="button" value="취소" onClick={handleCancel} />
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
