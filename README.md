<h2>게시판1</h2>

<ul>
        <li>배포 url : https://board-bff0f.web.app/</li>
</ul>

<h3>프로젝트 소개</h3>
회원가입, 로그인 후 사용 할 수 있는 게시판 입니다.


<h3>개발 환경</h3>
<ul>
      <li>Front : React, Ts, Context API, Scss</li>
      <li>Back : firebase</li>
      <li>버전 및 이슈 관리 : Github</li>
      <li>디자인 : Figma</li>
      <li>서비스 배포 환경 : firebase</li>
</ul>


<h3>채택한 개발 기술</h3>
<ul>
      <li> 상태 관리에는 Redux Toolkit 사용<br>
          Redux Toolkit은 프론트엔드에서 많이 사용되는 상태 관리 라이브러리로, 프로젝트에서 이를 선택해 구현해보았습니다.<br>
          Redux Toolkit은 상태 관리의 표준화된 방식과 강력한 기능을 제공한다는 점에서 매력적이었습니다. <br>
          하지만 사용해보면서 설정해야 할 요소들이 많아 초기 학습 곡선이 높다고 느꼈습니다.<br>
          특히, 슬라이스(slice) 생성, 스토어 구성, 미들웨어 설정 등 다양한 초기 설정 작업이 필요해 처음 접근하기에는 다소 복잡하게 느껴질 수 있었습니다.<br> 
          이러한 이유로, Redux Toolkit은 확장성과 구조화된 상태 관리에는 강점을 보이지만, 단순한 프로젝트에서는 진입 장벽이 높다고 생각하게 되었습니다.
      </li>
</ul>



<h3>프로젝트 구조</h3>

```
public
index.html
logo512.png
│  └─ robots.txt
├─ src
│  ├─ App.tsx
│  ├─ components
│  │  ├─ board
│  │  │  ├─ Header.tsx
│  │  │  ├─ board.tsx
│  │  │  ├─ modifyForm.tsx
│  │  │  └─ page.tsx
│  │  ├─ comment
│  │  │  ├─ Comment.tsx
│  │  │  ├─ CommentModify.tsx
│  │  │  └─ ReplyComment.tsx
│  │  └─ users
│  │     ├─ Form.tsx
│  │     ├─ login.tsx
│  │     └─ sign.tsx
│  ├─ firebase.ts
│  ├─ index.tsx
│  ├─ logo.png
│  ├─ react-app-env.d.ts
│  ├─ redux
│  │  ├─ reducer.ts
│  │  ├─ slices
│  │  │  ├─ ReplyComment
│  │  │  │  └─ ReplyCommentSlice.ts
│  │  │  ├─ boardItemDeleteSlice.ts
│  │  │  ├─ boardItemModifySlice.ts
│  │  │  ├─ boardItemSlice.ts
│  │  │  ├─ boardPageLikedSlice.ts
│  │  │  ├─ boardSlice.ts
│  │  │  ├─ commentSlice
│  │  │  │  ├─ commentDeleteSlice.ts
│  │  │  │  ├─ commentModifySlice.ts
│  │  │  │  └─ commentSlice.ts
│  │  │  └─ loginSlice.ts
│  │  ├─ store.ts
│  │  └─ thunks
│  │     ├─ ReplyCommentThunk
│  │     │  └─ commentReplyThunk.ts
│  │     ├─ boardDelteThunk.ts
│  │     ├─ boardFormThunk.ts
│  │     ├─ boardModifyThunk.ts
│  │     ├─ boardPageLikeOverturnThunk.ts
│  │     ├─ boardPageLikeThunks.ts
│  │     └─ commentThunk
│  │        ├─ commentDeleteThunk.ts
│  │        ├─ commentModifiyThunk.ts
│  │        └─ commentNewThunk.ts
│  ├─ reportWebVitals.ts
│  └─ scss
│     ├─ main.css
│     ├─ main.css.map
│     ├─ main.scss
│     ├─ style.css
│     ├─ style.css.map
│     └─ style.scss
└─ /
```



<h3>페이지 별 주요 기능</h3>
<h4>[ 메인 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/6dc32227-47c8-431d-84d5-4c08db7d572f" alt="메인 페이지"/>
<ul>
      <li>회원가입, 로그인 후 사용 할 수 있는 게시판 입니다.</li>
      <li>로그인 하지 않으면 작성 할 수 있는 버튼이 비활성화 됩니다.</li>
</ul>

<h4>[ 회원 가입 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/efb9bc59-dc43-4b4b-a992-2cdaa517d12f" alt="회원 가입 페이지"/>
<ul>
      <li>이메일 형식으로 가입을 할 수 있습니다.</li>
</ul>

<h4>[ 로그인 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/f6668392-65a3-4f6e-a63d-b552250ee0ed" alt="로그인 페이지"/>
<ul>
      <li>회원 가입 했던 이메일로 로그인 후 목록으로 연동 됩니다.</li>
</ul>

<h4>[ 상세 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/bac1ae85-5fc0-4521-9d36-cda8e92a6e00" alt="상세 페이지"/>
<ul>
      <li>다른 사용자가 작성한 글을 보고 좋아요, 댓글을 작성 할 수 있습니다.</li>
      <li>실시간으로 좋아요 수, 댓글 수를 확인 할 수 있습니다.</li>
</ul>

<h4>[ 작성 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/289231c8-ed99-4265-93cf-40e43dda9631" alt="작성 페이지"/>
<ul>
      <li>이미지 첨부 가능하며 이미지 선택 후 업로드버튼을 눌러야 등록 됩니다.</li>
      <li>삭제버튼 선택 시 업로드한 이미지 제거 됩니다.</li>
</ul>

<h3>프로젝트 후기</h3>
create react app의 react 활용해 CRUD 기능을 갖춘 게시판을 구현하며, 상태 관리 및 사용자 맞춤형 기능을 중심으로 설계했습니다. <br>
Redux Toolkit를 활용하여 상태 관리의 편리함을 체감할 수 있었지만<br>
진입 장벽이 높기에 많은 시간이 소요 되었습니다.
사용자 정보를 기반으로 동적으로 UI가 변경되도록 설계 하였습니다.<br>
로그인한 사용자만 수정 및 삭제 버튼이 활성화되도록 구현하여 보안성과 접근성을 강화 하였습니다.<br>
