import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { creatBoard } from "../../redux/slices/boardSlice";
import { Link } from "react-router-dom";

interface Boardtype {
  did: string;
  title: string;
  content: string;
  timedata: Date;
  userUid: string;
  isModified: boolean;
  index: string;
}
const Board = () => {
  const dispatch = useDispatch();
  const [boardDatat, setBoardData] = useState<Boardtype[]>([]);

  const handleLinkClick = () => {
    dispatch(creatBoard(1));
  };

  //페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const handleBoardDataList = async () => {
    //컬렉션
    const userCollection = collection(firestore, "users");

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
      };

      return boardItem;
    });
    setBoardData(newData);
  };

  //날짜
  /**
   * 'ko-KR'는 날짜 형식을 지정하는 로케일을 나타내며, 'numeric' 및 '2-digit'은 각각 년도, 월, 일의 형식을 지정합니다.
   * 이 형식을 toLocaleDateString()에 전달하여 사용하면 해당 날짜를 원하는 형식으로 변환할 수 있습니다.
   */
  useEffect(() => {
    handleBoardDataList();
    const itemList = getItemsForPage(currentPage);
  }, [boardDatat, currentPage]);

  const itemsPerPage = 10; //데이터 출력 개수
  const getItemsForPage = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage; //보여줄 데이터 처음
    const endIndex = startIndex + itemsPerPage; //보여줄 데이터 마지막
    return boardDatat.slice(startIndex, endIndex); //데이터 전체
  };

  const handlerenderPagenation = () => {
    const totalPages = Math.ceil(boardDatat.length / itemsPerPage);

    let pageGroup = Math.ceil(currentPage / 5); // 현재 페이지가 속한 페이지 그룹 계산
    let first = (pageGroup - 1) * 5 + 1; // 현재 페이지 그룹의 첫 번째 페이지 번호 계산
    let last = Math.min(pageGroup * 5, totalPages); // 현재 페이지 그룹의 마지막 페이지 번호 계산

    const paginationNumberGroup = [];
    for (let i = first; i <= last; i++) {
      paginationNumberGroup.push(
        <li key={i} onClick={() => setCurrentPage(i)}>
          {i}
        </li>
      );
    }
    return paginationNumberGroup;
  };

  return (
    <>
      <div className="container">
        <div className="board_box">
          <div className="board_top">
            <ul>
              <li>
                <div>No.</div>
                <div>제목</div>
                <div>작성일</div>
              </li>
            </ul>
          </div>
          <div className="board_body">
            <ul>
              {getItemsForPage(currentPage).map((item, index) => (
                <li key={index}>
                  <Link to={`/page/${item.did}`}>
                    <section className="link_map">
                      <div>{index}</div>
                      <div>{item.title}</div>
                      <div>
                        {item.timedata.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </div>
                    </section>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="write_btn">
            <Link to="/form" onClick={handleLinkClick}>
              글쓰기
            </Link>
          </div>
          <div className="pagenation_box">
            <div className="pagenation_list">
              <ul className="pagination">
                <li
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  이전
                </li>
                {handlerenderPagenation()}
                <li
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  다음
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
