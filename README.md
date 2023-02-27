# JayStargram

#인스타그램클론

사전계획 ---02/16---
프론트:
React & TypeScript
(Redux, Redux-Toolkit, RTK-Query?)
고민(Firebase 와 잘 맞는가?)

벡엔드:
FireBase
(인증, DB, Store, Hosting)

기능:
회원가입/로그인/유저인증/유저프로필/친구기능
포스트작성(크롭기능)/조회/수정/댓글작성/즐겨찾기
메세지 전송/푸쉬/채팅/무시 기능

React 구성계획
무엇을 컴포넌트 모듈화 할것인가?

폴더 구조

```bash
src
index.tsx
App.tsx
Router.tsx

---api
------api 데이터 통신 관련 ts 파일

---components
------common
------page
------각기능별폴더

---redux

```

```bash
jaystargram
├─ src
│ ├─ api
│ │ └─ firebaseapi.ts
│ ├─ App.css
│ ├─ App.test.tsx
│ ├─ App.tsx
│ ├─ components
│ │ ├─ common
│ │ │ ├─ Button.tsx
│ │ │ ├─ Form.tsx
│ │ │ ├─ ImgCrop.tsx
│ │ │ ├─ Input.tsx
│ │ │ ├─ ProfileBox.tsx
│ │ │ ├─ Serach.tsx
│ │ │ └─ SerachResults.tsx
│ │ ├─ Header.tsx
│ │ ├─ Messages
│ │ │ └─ MessageItem.tsx
│ │ ├─ pages
│ │ │ ├─ Author.tsx
│ │ │ ├─ Home.tsx
│ │ │ ├─ Login.tsx
│ │ │ ├─ Main.tsx
│ │ │ ├─ Message.tsx
│ │ │ ├─ MessageRoom.tsx
│ │ │ ├─ Post.tsx
│ │ │ ├─ PostDetail.tsx
│ │ │ ├─ PostEdit.tsx
│ │ │ ├─ PostList.tsx
│ │ │ ├─ Profile.tsx
│ │ │ └─ SignUp.tsx
│ │ └─ Post
│ │ ├─ Comment.tsx
│ │ ├─ CommentItem.tsx
│ │ ├─ PostAuthorDetail.tsx
│ │ ├─ PostDetailItem.tsx
│ │ ├─ postfunction.ts
│ │ └─ PostItem.tsx
│ ├─ customhook
│ ├─ firebase
│ │ └─ index.ts
│ ├─ index.css
│ ├─ index.tsx
│ ├─ logo.svg
│ ├─ react-app-env.d.ts
│ ├─ reportWebVitals.ts
│ ├─ Router.tsx
│ ├─ setupTests.ts
│ ├─ Styled.d.ts
│ └─ theme.ts
├─ tree.txt
├─ tsconfig.json
└─ 진행정리사항.txt
```
