<h2>Catcatch(Pc ver)</h2>

<ul>
        <li>배포 url : https://new-context-board.web.app/</li>
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
      <li> 상태 관리에는 Context API 사용<br>
           React의 Context API는 상태 관리 라이브러리를 사용하지 않고도 React에 내장된 훅을 통해 상태 관리를 할 수 있는 도구입니다.<br> 
           이는 Redux Toolkit에 비해 진입장벽이 낮은 편입니다. <br>
           그러나 TypeScript와 함께 사용할 경우, 초기값을 타입에 맞게 정확히 설정해야 한다는 점을 유의해야 하는 것을 알았습니다.
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
<img src="https://github.com/user-attachments/assets/4cb00862-14d2-44cc-add7-c77a5f5ce4e5" alt="메인 페이지"/>
<ul>
      <li>회원가입, 로그인 후 사용 할 수 있는 게시판 입니다.</li>
      <li>로그인 하지 않으면 작성 할 수 있는 버튼이 비활성화 됩니다.</li>
</ul>

<h4>[ 회원 가입 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/83e31e5f-1653-403f-81f1-ab31e270fa18" alt="회원 가입 페이지"/>
<ul>
      <li>이메일 형식으로 가입을 할 수 있습니다.</li>
</ul>

<h4>[ 로그인 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/5bdf0f66-2fd3-4fc2-98d3-c6d9ed510cea" alt="로그인 페이지"/>
<ul>
      <li>회원 가입 했던 이메일로 로그인 후 목록으로 연동 됩니다.</li>
</ul>

<h4>[ 상세 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/3ba1b731-dabb-4ceb-a24b-91b4a2149a98" alt="상세 페이지"/>
<ul>
      <li>다른 사용자가 작성한 글을 보고 좋아요, 댓글을 작성 할 수 있습니다.</li>
      <li>실시간으로 좋아요 수, 댓글 수를 확인 할 수 있습니다.</li>
</ul>

<h4>[ 작성 페이지 ] </h4>
<img src="https://github.com/user-attachments/assets/81615f0d-bf67-4de5-bf59-9cccde57c84b" alt="작성 페이지"/>
<ul>
      <li>이미지 첨부 가능하며 이미지 선택 후 업로드 아이콘을 눌러야 등록 됩니다.</li>
      <li>휴지통 아이콘 선택 시 업로드한 이미지 제거 됩니다.</li>
</ul>

<h3>프로젝트 후기</h3>
Vite와 React를 활용해 CRUD 기능을 갖춘 게시판을 구현하며, 상태 관리 및 사용자 맞춤형 기능을 중심으로 설계했습니다. <br>
Context API를 활용하여 상태 관리의 편리함을 체감할 수 있었고<br>
사용자 정보를 기반으로 동적으로 UI가 변경되도록 설계 하였습니다.<br>
로그인한 사용자만 수정 및 삭제 버튼이 활성화되도록 구현하여 보안성과 접근성을 강화 하였습니다.<br>
Vite를 사용한 개발 환경 설정이 매우 빠르고 간단해 작업 효율성을 높였습니다.
