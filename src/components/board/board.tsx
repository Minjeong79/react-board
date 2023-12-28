import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//화면 이동을 위해 BrowserRouter연동
import { Link } from "react-router-dom";

const Board = () => {
  //게시판 전체 데이터
  const boardItemState = useSelector(
    (state: any) => state.boardItemMap.boarditem
  );
  //게시판 수정 한 전체 데이터
  const modifyBoarddata = useSelector(
    (state: any) => state.boardModify.boarditem
  );

  //날짜
  function formatDate(dateSt: string) {
    const userDates = new Date(dateSt);
    return userDates.toLocaleDateString("ko-KR");
  }

  //페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; //데이터 출력 개수
  const getItemsForPage = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage; //보여줄 데이터 처음
    const endIndex = startIndex + itemsPerPage; //보여줄 데이터 마지막
    return Object.values(boardItemState).slice(startIndex, endIndex); //데이터 전체
  };

  useEffect(() => {
    const itemList = getItemsForPage(currentPage);
  }, [currentPage]);

  const handlerenderPagenation = () => {
    const totalPages = Math.ceil(
      Object.values(boardItemState).length / itemsPerPage
    );

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
              {getItemsForPage(currentPage).map((items: any, index) =>
                items.map((item: any, innerIndex: number) => {
                  const isModifiedDataIdx =
                    modifyBoarddata?.[index]?.length - 1;
                  const isModifiedData =
                    modifyBoarddata?.[index]?.[isModifiedDataIdx];

                  if (
                    isModifiedData?.isModified === true &&
                    item.did === isModifiedData?.did
                  ) {
                    return (
                      <li
                        key={innerIndex}
                        style={{ backgroundColor: "orange" }}
                      >
                        <Link to={`/page/${item.did}`}>
                          <section className="link_map">
                            <div>{index}</div>
                            <div>{isModifiedData.title}</div>
                            <div>{formatDate(item.timedata)}</div>
                          </section>
                        </Link>
                      </li>
                    );
                  } else {
                    return (
                      <li key={innerIndex}>
                        <Link to={`/page/${item.did}`}>
                          <div className="link_map">
                            <div>{index}</div>
                            <div>{item.title}</div>
                            <div>{formatDate(item.timedata)}</div>
                          </div>
                        </Link>
                      </li>
                    );
                  }
                })
              )}
            </ul>
          </div>

          <div className="pagenation_box">
            <div className="pagenation_list">
              <ul className="pagination">
                <li
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    console.log(`${currentPage}`);
                  }}
                >
                  이전
                </li>
                {handlerenderPagenation()}
                <li
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    console.log(`${currentPage}`);
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
