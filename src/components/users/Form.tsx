import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import addUserData from "../../redux/thunks/boardFormThunk";
import { customAlphabet } from "nanoid";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { firebaseApp } from "../../firebase";
import { RootLoginState } from "../../redux/reducer";

const Form = () => {
  const userUidValue = useAppSelector(
    (state: RootLoginState) => state.login.user
  );
  const userId = userUidValue?.uid;
  const displayName = userUidValue?.displayName;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const nanoid = customAlphabet("123456789", 6);
  const strId = nanoid();
  const [collectionId] = useState(() => {
    const nanoid2 = customAlphabet("123456789", 5);
    return Number(nanoid2());
  });

  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
  });

  //이미지 등록 관련
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(firebaseApp);

  const handleWrite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldName = e.currentTarget.name;
    const fieldValue = e.currentTarget.value;

    if (!formValue) {
      window.confirm("제목과 내용을 입력 해주세요");
      return;
    }
    try {
      const userData = {
        did: collectionId,
        title: formValue.title,
        content: formValue.content,
        timedata: new Date(),
        userUid: userId as string,
        isModified: false,
        index: strId,
        displayName: displayName,
      };
      await dispatch(
        addUserData({
          boardId: collectionId,
          boarditem: userData,
        })
      );
      setFormValue({
        ...formValue,
        [fieldName]: fieldValue,
      });
      navigate(`/`);
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

  const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageUpload === null) return;
    //경로
    const imageRef = ref(storage, `images/${collectionId}/${imageUpload.name}`);

    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };

  //업로드 할 이미지 삭제
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
  return (
    <div>
      <div className="container">
        <div>
          <h1>글작성 </h1>
        </div>
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
    </div>
  );
};

export default Form;
